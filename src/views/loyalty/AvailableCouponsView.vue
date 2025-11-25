<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  getAvailableCoupons,
  getCustomerPoints,
  purchaseCoupon
} from '@/services/loyalty.service';
import type { Coupon } from '@/interfaces/loyalty.interface';
import {
  BContainer, BRow, BCol, BCard, BButton, BBadge, BSpinner, BAlert, BModal, BFormInput, BFormGroup
} from 'bootstrap-vue-next';

const router = useRouter();

// --- STATE ---
const coupons = ref<Coupon[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Simulation State (Karena belum ada auth beneran)
const currentRole = ref<'Superadmin' | 'Customer'>('Customer');
const currentCustomerId = ref('550e8400-e29b-41d4-a716-446655440000'); // Default ID from backend example
const currentPoints = ref(0);

// Modal State
const showPurchaseModal = ref(false);
const selectedCoupon = ref<Coupon | null>(null);
const isPurchasing = ref(false);

// --- FETCH DATA ---
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [couponsData, pointsData] = await Promise.all([
      getAvailableCoupons(),
      currentRole.value === 'Customer' ? getCustomerPoints(currentCustomerId.value) : Promise.resolve(null)
    ]);

    coupons.value = couponsData;
    if (pointsData) {
      currentPoints.value = pointsData.points;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch data';
  } finally {
    isLoading.value = false;
  }
};

// --- ACTIONS ---
const handleRefresh = () => {
  fetchData();
};

const goToCreate = () => {
  router.push('/loyalty/create');
};

const goToEdit = (coupon: Coupon) => {
  router.push(`/loyalty/edit/${coupon.id}`); // Pastikan route ini didaftarkan nanti
};

// --- PURCHASE LOGIC (PBI-FE-L5) ---
const openPurchaseModal = (coupon: Coupon) => {
  selectedCoupon.value = coupon;
  showPurchaseModal.value = true;
};

const confirmPurchase = async () => {
  if (!selectedCoupon.value) return;

  isPurchasing.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    await purchaseCoupon({
      customerId: currentCustomerId.value,
      couponId: selectedCoupon.value.id
    });

    successMessage.value = `Successfully purchased coupon: ${selectedCoupon.value.name}`;
    showPurchaseModal.value = false;

    // Refresh points and data
    await fetchData();
  } catch (err: any) {
    // Show error in alert
    error.value = err.response?.data?.message || err.message || "Failed to purchase coupon";
    showPurchaseModal.value = false;
  } finally {
    isPurchasing.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <BContainer class="py-4">
    <!-- ROLE SIMULATOR (Untuk Testing) -->
    <BCard class="mb-4 bg-light border-0">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 class="mb-2">🕵️ Role Simulator</h5>
          <div class="d-flex gap-2 align-items-center">
            <BFormGroup label="Role" label-class="fw-bold me-2" class="mb-0">
               <select v-model="currentRole" class="form-select form-select-sm" @change="handleRefresh">
                <option value="Superadmin">Superadmin</option>
                <option value="Customer">Customer</option>
              </select>
            </BFormGroup>

            <BFormGroup v-if="currentRole === 'Customer'" label="Cust ID" label-class="fw-bold me-2" class="mb-0">
              <BFormInput v-model="currentCustomerId" size="sm" @blur="handleRefresh" />
            </BFormGroup>
          </div>
        </div>
        <div v-if="currentRole === 'Customer'" class="text-end">
          <span class="text-muted">Your Loyalty Points:</span>
          <h2 class="text-primary mb-0">{{ currentPoints }} pts</h2>
        </div>
      </div>
    </BCard>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Available Coupons</h1>
      <div class="d-flex gap-2">
        <BButton v-if="currentRole === 'Superadmin'" variant="primary" @click="goToCreate">
          + Create Coupon
        </BButton>
        <BButton v-if="currentRole === 'Customer'" variant="outline-info" to="/loyalty/my-coupons">
          My Purchased Coupons
        </BButton>
      </div>
    </div>

    <!-- ALERTS -->
    <BAlert v-if="error" variant="danger" :model-value="!!error" dismissible @close="error = null">{{ error }}</BAlert>
    <BAlert v-if="successMessage" variant="success" :model-value="!!successMessage" dismissible @close="successMessage = null">{{ successMessage }}</BAlert>

    <!-- LOADING -->
    <div v-if="isLoading" class="text-center py-5">
      <BSpinner label="Loading..." />
    </div>

    <!-- COUPON LIST (Cards) -->
    <BRow v-else>
      <BCol v-for="coupon in coupons" :key="coupon.id" md="4" class="mb-4">
        <BCard class="h-100 shadow-sm">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title text-primary">{{ coupon.name }}</h5>
            <BBadge variant="warning" class="fs-6">{{ coupon.percentOff }}% OFF</BBadge>
          </div>

          <p class="card-text text-muted">{{ coupon.description }}</p>

          <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
            <span class="fw-bold text-success">{{ coupon.points }} Pts</span>

            <!-- BUTTONS BASED ON ROLE -->
            <div v-if="currentRole === 'Superadmin'">
              <BButton size="sm" variant="outline-dark" @click="goToEdit(coupon)">Edit Coupon</BButton>
            </div>
            <div v-else>
              <BButton
                size="sm"
                :variant="currentPoints >= coupon.points ? 'primary' : 'secondary'"
                :disabled="currentPoints < coupon.points"
                @click="openPurchaseModal(coupon)"
              >
                {{ currentPoints >= coupon.points ? 'Purchase' : 'Not Enough Points' }}
              </BButton>
            </div>
          </div>
        </BCard>
      </BCol>

      <div v-if="coupons.length === 0" class="text-center text-muted">
        <p>No coupons available at the moment.</p>
      </div>
    </BRow>

    <!-- PBI-FE-L5: PURCHASE CONFIRMATION MODAL -->
    <BModal
      v-model="showPurchaseModal"
      title="Confirm Purchase"
      :ok-disabled="isPurchasing"
      ok-title="Confirm Purchase"
      ok-variant="success"
      @ok="confirmPurchase"
    >
      <div v-if="selectedCoupon">
        <p>Are you sure you want to purchase <strong>{{ selectedCoupon.name }}</strong>?</p>
        <ul class="list-unstyled bg-light p-3 rounded">
          <li class="d-flex justify-content-between mb-1">
            <span>Current Points:</span> <strong>{{ currentPoints }}</strong>
          </li>
          <li class="d-flex justify-content-between mb-1 text-danger">
            <span>Cost:</span> <strong>- {{ selectedCoupon.points }}</strong>
          </li>
          <hr class="my-2">
          <li class="d-flex justify-content-between fw-bold text-success">
            <span>Remaining Points:</span> <strong>{{ currentPoints - selectedCoupon.points }}</strong>
          </li>
        </ul>
      </div>
    </BModal>

  </BContainer>
</template>
