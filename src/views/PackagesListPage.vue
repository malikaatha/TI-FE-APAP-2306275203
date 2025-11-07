<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllPackages } from '@/services/package.service';
import { BContainer, BButton, BSpinner, BAlert, BBadge } from 'bootstrap-vue-next';

import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

DataTable.use(DataTablesCore);

const packages = ref([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const columns = [
  { data: 'packageName', title: 'Package Name' },
  { data: 'status', title: 'Status' },
  { data: 'price', title: 'Price',
    render: (data: any) => `Rp ${new Intl.NumberFormat('id-ID').format(data)}`
  },
  { data: 'userId', title: 'User ID' },
  { data: 'id', title: 'Actions', orderable: false,
    render: (data: any, type: any, row: any) => {

      return `<button class="btn btn-info btn-sm" data-id="${data}">View</button>`;
    }
  }
];

const dtOptions = {
  responsive: true,
  select: true,
};

const fetchPackages = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    packages.value = await getAllPackages();
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch packages.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPackages);
</script>

<template>
  <BContainer>
    <h1 class="mb-4">All Tour Packages</h1>

    <div class="mb-3">
      <BButton variant="primary">Create New Package</BButton>
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
        width="100%"
      >
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Status</th>
            <th>Price</th>
            <th>User ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <template #status="props">
          <BBadge :variant="props.data === 'Pending' ? 'warning' : 'success'">
            {{ props.data }}
          </BBadge>
        </template>
      </DataTable>
    </div>

  </BContainer>
</template>

<style>
@import 'datatables.net-bs5';
</style>
