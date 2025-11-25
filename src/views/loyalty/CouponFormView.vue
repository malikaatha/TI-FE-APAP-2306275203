<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createCoupon, updateCoupon, getAvailableCoupons } from '@/services/loyalty.service';
import type { Coupon } from '@/interfaces/loyalty.interface';
import {
  BContainer, BCard, BForm, BFormGroup, BFormInput, BFormTextarea, BButton, BAlert, BSpinner
} from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const couponId = route.params.id as string;

const form = reactive({
  name: '',
  description: '',
  points: 100,
  percentOff: 5
});

const isLoading = ref(false);
const error = ref<string | null>(null);

// Fetch Data for Edit Mode
const loadCouponData = async () => {
  if (!isEditMode.value) return;

  isLoading.value = true;
  try {
    // Karena di service sebelumnya kita cuma punya 'getAll', kita filter manual di sini
    // (Idealnya BE punya endpoint getCouponById, tapi kita pakai yang ada aja)
    const allCoupons = await getAvailableCoupons();
    const found = allCoupons.find((c: Coupon) => c.id === couponId);

    if (found) {
      form.name = found.name;
      form.description = found.description;
      form.points = found.points;
      form.percentOff = found.percentOff;
    } else {
      error.value = "Coupon not found";
    }
  } catch (err) {
    error.value = "Failed to fetch coupon details";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    if (isEditMode.value) {
      await updateCoupon(couponId, form);
      alert('Coupon updated successfully!');
    } else {
      await createCoupon(form);
      alert('Coupon created successfully!');
    }
    router.push('/loyalty/coupons');
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || "Operation failed";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadCouponData);
</script>

<template>
  <BContainer class="py-4">
    <BButton variant="outline-secondary" class="mb-3" to="/loyalty/coupons">&larr; Back to List</BButton>

    <h1>{{ isEditMode ? 'Edit Coupon' : 'Create New Coupon' }}</h1>

    <div v-if="isLoading && isEditMode" class="text-center">
      <BSpinner />
    </div>

    <BAlert v-if="error" variant="danger" show>{{ error }}</BAlert>

    <BCard v-if="!isLoading || !isEditMode" class="mt-3 shadow-sm">
      <BForm @submit.prevent="handleSubmit">
        <BFormGroup label="Coupon Name *" class="mb-3">
          <BFormInput v-model="form.name" required placeholder="e.g. End Year Sale" />
        </BFormGroup>

        <BFormGroup label="Description *" class="mb-3">
          <BFormTextarea v-model="form.description" required rows="3" placeholder="Describe the coupon..." />
        </BFormGroup>

        <div class="row">
          <div class="col-md-6">
            <BFormGroup label="Points Cost *" class="mb-3">
              <BFormInput v-model.number="form.points" type="number" min="0" required />
            </BFormGroup>
          </div>
          <div class="col-md-6">
            <BFormGroup label="Discount Percentage (%) *" class="mb-3">
              <BFormInput v-model.number="form.percentOff" type="number" min="1" max="100" required />
            </BFormGroup>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-end gap-2">
          <BButton variant="secondary" to="/loyalty/coupons">Cancel</BButton>
          <BButton type="submit" variant="primary" :disabled="isLoading">
            {{ isEditMode ? 'Update Coupon' : 'Create Coupon' }}
          </BButton>
        </div>
      </BForm>
    </BCard>
  </BContainer>
</template>
