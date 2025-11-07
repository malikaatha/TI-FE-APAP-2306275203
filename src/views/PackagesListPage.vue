<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllPackages } from '@/services/package.service';
import { BContainer, BButton, BTable, BSpinner, BAlert } from 'bootstrap-vue-next';

const packages = ref([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

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

onMounted(() => {
  fetchPackages();
});

const fields = [
  { key: 'packageName', label: 'Package Name', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'price', label: 'Price' },
  { key: 'userId', label: 'User ID' },
  { key: 'actions', label: 'Actions' }
];
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

    <BTable
      v-if="!isLoading && !error"
      :items="packages"
      :fields="fields"
      striped
      hover
      responsive
    >
      <template #cell(actions)="data">
        <BButton size="sm" variant="info">View</BButton>
      </template>
    </BTable>

  </BContainer>
</template>
