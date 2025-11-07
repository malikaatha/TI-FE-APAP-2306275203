<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPackageById, updatePackage } from '@/services/package.service';
import {
  BContainer, BCard, BRow, BCol,
  BButton, BAlert, BSpinner, BTable,
  BForm, BFormGroup, BFormInput, BCardText
} from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();
const packageId = route.params.id as string;

const packageData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const editFormData = reactive({
  packageName: '',
  quota: 0,
  startDate: '',
  endDate: ''
});

const fetchPackage = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getPackageById(packageId);
    packageData.value = response.data;

    editFormData.packageName = packageData.value.packageName;
    editFormData.quota = packageData.value.quota;
    editFormData.startDate = packageData.value.startDate.slice(0, 16);
    editFormData.endDate = packageData.value.endDate.slice(0, 16);
  } catch (err: any) {
    error.value = `Failed to load package details: ${err.response?.data?.message || err.message}`;
  } finally {
    isLoading.value = false;
  }
};

const handleUpdate = async () => {
  try {
    await updatePackage(packageId, editFormData);
    alert('Package updated successfully!');
    router.push({ name: 'package-detail', params: { id: packageId } });
  } catch (err: any) {
    alert(`Update failed: ${err.response?.data?.message || err.message}`);
  }
};

const planFields = [
  { key: 'planName', label: 'Plan Name' },
  { key: 'activityType', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' }
];

const viewPlan = (planId: string) => {
  router.push({ name: 'plan-detail', params: { id: planId } });
};

const goToCreatePlan = () => {
  router.push({ name: 'plan-create', params: { id: packageId } });
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
      <BButton variant="outline-secondary" :to="{ name: 'package-detail', params: { id: packageId } }" class="mb-3">
        &larr; Back to Details
      </BButton>

      <BCard header="Edit Package Information">
        <BForm @submit.prevent="handleUpdate">
          <BRow>
            <BCol md="6">
              <BFormGroup label="Package Name:" label-for="packageName">
                <BFormInput id="packageName" v-model="editFormData.packageName" required />
              </BFormGroup>
            </BCol>
            <BCol md="6">
              <BFormGroup label="User ID (Read-only):" label-for="userId">
                <BFormInput id="userId" :value="packageData.userId" readonly disabled />
              </BFormGroup>
            </BCol>
          </BRow>

          <BRow class="mt-3">
            <BCol md="4">
              <BFormGroup label="Quota:" label-for="quota">
                <BFormInput id="quota" v-model="editFormData.quota" type="number" required />
              </BFormGroup>
            </BCol>
            <BCol md="4">
              <BFormGroup label="Start Date:" label-for="startDate">
                <BFormInput id="startDate" v-model="editFormData.startDate" type="datetime-local" required />
              </BFormGroup>
            </BCol>
            <BCol md="4">
              <BFormGroup label="End Date:" label-for="endDate">
                <BFormInput id="endDate" v-model="editFormData.endDate" type="datetime-local" required />
              </BFormGroup>
            </BCol>
          </BRow>

          <div class="mt-4">
            <BButton
              type="submit"
              variant="primary"
              :disabled="packageData.status !== 'Pending' || (packageData.listPlan && packageData.listPlan.length > 0)"
              title="Can only edit if status is 'Pending' and package has no plans"
            >
              Save Changes
            </BButton>
            <BAlert
              v-if="packageData.status !== 'Pending' || (packageData.listPlan && packageData.listPlan.length > 0)"
              variant="warning"
              class="mt-3"
              show
            >
              Package details cannot be edited. Editing is only allowed when the package status is "Pending" and it has no associated plans.
            </BAlert>
          </div>
        </BForm>
      </BCard>

      <BCard title="Manage Plans" class="mt-4">
        <div class="d-flex justify-content-end mb-3">
          <BButton
            variant="success"
            @click="goToCreatePlan"
            :disabled="packageData.status !== 'Pending'"
            title="Can only add plans if package is 'Pending'"
          >
            + Create New Plan
          </BButton>
        </div>
        <BTable :items="packageData.listPlan" :fields="planFields" striped hover responsive>
          <template #cell(price)="data">
            Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price) }}
          </template>
          <template #cell(actions)="data">
            <BButton size="sm" variant="info" @click="viewPlan(data.item.id)">View Plan</BButton>
          </template>
        </BTable>
        <BCardText v-if="!packageData.listPlan || packageData.listPlan.length === 0">
          No plans have been added to this package yet.
        </BCardText>
      </BCard>
    </div>
  </BContainer>
</template>
