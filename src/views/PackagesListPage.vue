<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllPackages } from '@/services/package.service';
import { BContainer, BButton, BSpinner, BAlert, BBadge } from 'bootstrap-vue-next';
import { useRouter } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import type { Package } from '@/types/package.types';

DataTable.use(DataTablesCore);

const router = useRouter();

const packages = ref<Package[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const dtOptions = {
  dom: 'Bfrtip',
  pageLength: 10,
  responsive: true,
  language: {
    lengthMenu: 'Display _MENU_ records per page',
    zeroRecords: 'No records found',
    info: 'Showing page _PAGE_ of _PAGES_',
    infoEmpty: 'No records available',
    infoFiltered: '(filtered from _MAX_ total records)'
  }
};

const columns = [
  { data: 'packageName', title: 'Package Name' },
  {
    data: 'status',
    title: 'Status',
    // Gunakan render function di sini
    render: function(data, type, row) {
      if (type === 'display') {
        const variant = data === 'Pending' ? 'warning' : 'success';
        return `<span class="badge text-bg-${variant}">${data}</span>`;
      }
      return data;
    }
  },
  {
    data: 'price',
    title: 'Price',
    render: (data: number) => `Rp ${new Intl.NumberFormat('id-ID').format(data)}`
  },
  { data: 'userId', title: 'User ID' },
  { data: 'id', title: 'Actions', orderable: false }
];

const fetchPackages = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    packages.value = await getAllPackages();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch packages';
  } finally {
    isLoading.value = false;
  }
};

const viewPackage = (packageId: string) => {
  router.push({ name: 'package-detail', params: { id: packageId } });
};

onMounted(fetchPackages);
</script>

<template>
  <BContainer>
    <h1 class="mb-4">All Tour Packages</h1>

<div class="mb-3">
  <BButton variant="primary" :to="{ name: 'package-create' }">
    Create New Package
  </BButton>
</div>

    <BAlert v-if="error" variant="danger" show>{{ error }}</BAlert>

    <div v-if="isLoading" class="text-center">
      <BSpinner label="Loading..." />
      <p>Loading packages...</p>
    </div>

    <div v-if="!isLoading && !error">
      <DataTable
        :columns="columns"
        :data="packages"
        :options="dtOptions"
        class="table table-striped table-hover"
        width="100%">
        <template #column-4="slotProps">
          <BButton size="sm" variant="info" @click="viewPackage(slotProps.cellData)">
            View
          </BButton>
        </template>
      </DataTable>
    </div>

  </BContainer>
</template>

<style>
@import 'datatables.net-bs5';
</style>
