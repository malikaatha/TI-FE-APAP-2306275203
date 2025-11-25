<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPurchasedCoupons } from '@/services/loyalty.service';
import type { PurchasedCoupon } from '@/interfaces/loyalty.interface';
import { BContainer, BButton, BSpinner, BAlert, BBadge } from 'bootstrap-vue-next';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

DataTable.use(DataTablesCore);

// Hardcoded ID for simulation (harus sama dengan AvailableCouponsView)
const customerId = '550e8400-e29b-41d4-a716-446655440000';

const purchasedCoupons = ref<PurchasedCoupon[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const dtOptions = {
  dom: 'Bfrtip',
  pageLength: 5,
  responsive: true,
  order: [[3, 'desc']], // Sort by Purchased Date descending
};

const columns = [
  {
    data: 'code',
    title: 'Coupon Code',
    render: (data: string) => `<span class="fw-bold font-monospace">${data}</span>`
  },
  { data: 'coupon.name', title: 'Coupon Name' },
  {
    data: 'coupon.percentOff',
    title: 'Discount',
    render: (data: number) => `${data}%`
  },
  {
    data: 'purchasedDate',
    title: 'Purchased On',
    render: (data: string) => new Date(data).toLocaleDateString() + ' ' + new Date(data).toLocaleTimeString()
  },
  {
    data: 'usedDate',
    title: 'Status',
    render: (data: string | null) => {
      if (data) return `<span class="badge bg-secondary">Used on ${new Date(data).toLocaleDateString()}</span>`;
      return `<span class="badge bg-success">Active / Available</span>`;
    }
  },
  {
    data: 'code',
    title: 'Actions',
    orderable: false,
    width: '10%'
  }
];

const loadData = async () => {
  isLoading.value = true;
  try {
    purchasedCoupons.value = await getPurchasedCoupons(customerId);
  } catch (err: any) {
    error.value = "Failed to load purchased coupons.";
  } finally {
    isLoading.value = false;
  }
};

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  alert(`Code ${code} copied to clipboard!`);
};

onMounted(loadData);
</script>

<template>
  <BContainer class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>My Purchased Coupons</h1>
      <BButton variant="outline-secondary" to="/loyalty/coupons">Back to Store</BButton>
    </div>

    <BAlert v-if="error" variant="danger" show>{{ error }}</BAlert>

    <div v-if="isLoading" class="text-center">
      <BSpinner label="Loading..." />
    </div>

    <div v-else>
       <DataTable
        :columns="columns"
        :data="purchasedCoupons"
        :options="dtOptions"
        class="table table-striped table-hover align-middle"
        width="100%">

        <!-- Slot for Copy Button -->
        <template #column-5="slotProps">
           <BButton
             size="sm"
             variant="outline-primary"
             @click="copyCode(slotProps.cellData)"
             title="Copy Code"
           >
             📋 Copy
           </BButton>
        </template>
      </DataTable>
    </div>
  </BContainer>
</template>

<style>
@import 'datatables.net-bs5';
</style>
