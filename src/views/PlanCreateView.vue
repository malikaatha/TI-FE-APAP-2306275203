<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createPlan } from '@/services/plan.service';
import { getPackageById } from '@/services/package.service';
import {
  BContainer, BCard,
  BButton, BAlert, BSpinner,
  BForm, BFormGroup, BFormInput, BFormSelect
} from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();
const packageId = route.params.id as string;

const packageData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const newPlanForm = reactive({
  planName: '',
  activityType: null,
  startDate: '',
  endDate: '',
  startLocation: null,
  endLocation: null
});

const activityTypes = [
  { value: null, text: 'Please select an activity type' },
  { value: 'Flight', text: 'Flight' },
  { value: 'Accommodation', text: 'Accommodation' },
  { value: 'Vehicle Rental', text: 'Vehicle Rental' }
];

const locations = [
  { value: null, text: 'Please select a location' },
  { value: 'Jakarta (Provinsi)', text: 'Jakarta (Provinsi)' },
  { value: 'Bali (Provinsi)', text: 'Bali (Provinsi)' },
  { value: 'Jawa Barat (Provinsi)', text: 'Jawa Barat (Provinsi)' },
  { value: 'Kota Denpasar', text: 'Kota Denpasar' }
];

const fetchPackage = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getPackageById(packageId);
    packageData.value = response.data; // Sesuaikan jika perlu, lihat catatan di atas
    newPlanForm.startDate = packageData.value.startDate.slice(0, 16);
    newPlanForm.endDate = packageData.value.endDate.slice(0, 16);
  } catch (err: any)
    error.value = `Failed to load package data: ${err.response?.data?.message || err.message}`;
  } finally {
    isLoading.value = false;
  }
};

const handleCreatePlan = async () => {
  const planStart = new Date(newPlanForm.startDate);
  const planEnd = new Date(newPlanForm.endDate);
  const packageStart = new Date(packageData.value.startDate);
  const packageEnd = new Date(packageData.value.endDate);

  if (planEnd < planStart) {
    alert('Validation Error: End Date cannot be earlier than Start Date.');
    return;
  }
  if (planStart < packageStart) {
    alert('Validation Error: Plan Start Date cannot be earlier than Package Start Date.');
    return;
  }
  if (planEnd > packageEnd) {
    alert('Validation Error: Plan End Date cannot be later than Package End Date.');
    return;
  }
  if (newPlanForm.activityType === 'Accommodation' && newPlanForm.startLocation !== newPlanForm.endLocation) {
    alert('Validation Error: For Accommodation, Start Location and End Location must be the same.');
    return;
  }

  try {
    await createPlan(packageId, newPlanForm);
    alert('Plan created successfully!');
    router.push({ name: 'package-edit', params: { id: packageId } });
  } catch (err: any) {
    alert(`Failed to create plan: ${err.response?.data?.message || err.message}`);
  }
};

onMounted(fetchPackage);
</script>

<template>
  <BContainer class="my-4">
    <div v-if="isLoading" class="text-center mt-5">
      <BSpinner label="Loading..." />
    </div>

    <BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>

    <div v-else-if="packageData">
      <BButton variant="outline-secondary" :to="{ name: 'package-edit', params: { id: packageId } }" class="mb-3">
        &larr; Back to Edit Package
      </BButton>

      <BCard :header="`Create New Plan for: ${packageData.packageName}`">
        <BForm @submit.prevent="handleCreatePlan">
          <BFormGroup label="Plan Name:" label-for="newPlanName" class="mt-3">
            <BFormInput id="newPlanName" v-model="newPlanForm.planName" required />
          </BFormGroup>

          <BFormGroup label="Activity Type:" label-for="newActivityType" class="mt-3">
            <BFormSelect id="newActivityType" v-model="newPlanForm.activityType" :options="activityTypes" required />
          </BFormGroup>

          <BRow class="mt-3">
            <BCol md="6">
              <BFormGroup label="Start Date:" label-for="newStartDate">
                <BFormInput id="newStartDate" v-model="newPlanForm.startDate" type="datetime-local" required />
              </BFormGroup>
            </BCol>
            <BCol md="6">
              <BFormGroup label="End Date:" label-for="newEndDate">
                <BFormInput id="newEndDate" v-model="newPlanForm.endDate" type="datetime-local" required />
              </BFormGroup>
            </BCol>
          </BRow>

          <BRow class="mt-3">
            <BCol md="6">
              <BFormGroup label="Start Location:" label-for="newStartLocation">
                <BFormSelect id="newStartLocation" v-model="newPlanForm.startLocation" :options="locations" required />
              </BFormGroup>
            </BCol>
            <BCol md="6">
              <BFormGroup label="End Location:" label-for="newEndLocation">
                <BFormSelect id="newEndLocation" v-model="newPlanForm.endLocation" :options="locations" required />
              </BFormGroup>
            </BCol>
          </BRow>

          <div class="d-flex justify-content-end mt-4">
            <BButton variant="secondary" :to="{ name: 'package-edit', params: { id: packageId } }">Cancel</BButton>
            <BButton type="submit" variant="primary" class="ms-2">Create Plan</BButton>
          </div>
        </BForm>
      </BCard>
    </div>
  </BContainer>
</template>
