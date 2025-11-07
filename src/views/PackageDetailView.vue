<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPackageById, updatePackage, deletePackage, processPackage } from '@/services/package.service';
import { createPlan, deletePlan } from '@/services/plan.service';
import {
  BContainer, BCard, BRow, BCol, BButton, BAlert, BSpinner, BTable, BBadge,
  BForm, BFormGroup, BFormInput, BFormSelect, BModal
} from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();
const packageId = route.params.id as string;

const packageData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const isEditMode = ref(false);
const editFormData = reactive({ packageName: '', quota: 0, startDate: '', endDate: '' });

const showDeleteModal = ref(false);
const showProcessModal = ref(false);

const showPlanModal = ref(false);
const planForm = reactive({ planName: '', activityType: null, startDate: '', endDate: '', startLocation: '', endLocation: '' });
const activityTypes = [{ value: null, text: 'Please select an activity type' }, 'Flight', 'Accommodation', 'Vehicle Rental'];
const locations = ['DKI Jakarta (Provinsi)', 'Bali (Provinsi)', 'Jawa Barat (Provinsi)', 'Yogyakarta (Provinsi)'];

const planToDelete = ref<any>(null);
const showDeletePlanModal = ref(false);

const fetchPackage = async () => {
  try {
    isLoading.value = true;
    packageData.value = await getPackageById(packageId);
  } catch (err) {
    error.value = 'Failed to load package details.';
  } finally {
    isLoading.value = false;
  }
};

const enterEditMode = () => {
  if (packageData.value) {
    editFormData.packageName = packageData.value.packageName;
    editFormData.quota = packageData.value.quota;
    editFormData.startDate = packageData.value.startDate.slice(0, 16);
    editFormData.endDate = packageData.value.endDate.slice(0, 16);
    isEditMode.value = true;
  }
};

const handleUpdate = async () => {
  try {
    await updatePackage(packageId, editFormData);
    isEditMode.value = false;
    fetchPackage();
  } catch (err: any) {
    alert(`Update failed: ${err.response?.data || err.message}`);
  }
};

const handleDelete = async () => {
  try {
    await deletePackage(packageId);
    router.push('/packages');
  } catch (err: any) {
    alert(`Delete failed: ${err.response?.data || err.message}`);
  }
};

const handleProcess = async () => {
  try {
    await processPackage(packageId);
    showProcessModal.value = false;
    fetchPackage();
  } catch (err: any) {
    alert(`Process failed: ${err.response?.data || err.message}`);
  }
};

const handleCreatePlan = async () => {
  try {
    await createPlan(packageId, planForm);
    showPlanModal.value = false;
    Object.assign(planForm, { planName: '', activityType: null, startDate: '', endDate: '', startLocation: '', endLocation: '' });
    fetchPackage();
  } catch (err: any) {
    alert(`Failed to create plan: ${err.response?.data || err.message}`);
  }
};

const openDeletePlanConfirmation = (plan: any) => {
  planToDelete.value = plan;
  showDeletePlanModal.value = true;
};

const handleDeletePlan = async () => {
  if (planToDelete.value) {
    try {
      await deletePlan(planToDelete.value.id);
      showDeletePlanModal.value = false;
      planToDelete.value = null;
      fetchPackage();
    } catch (err: any) {
      alert(`Failed to delete plan: ${err.response?.data || err.message}`);
    }
  }
};

const planFields = [
  { key: 'planName', label: 'Plan Name' },
  { key: 'activityType', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' }
];

const totalPackagePrice = computed(() => {
  // Cek apakah packageData dan listPlan sudah ada
  if (packageData.value && packageData.value.listPlan) {

    // Gunakan .reduce() untuk menjumlahkan semua 'price' di dalam listPlan
    return packageData.value.listPlan.reduce((total, plan) => {
      // Pastikan harga adalah angka, jika tidak, anggap 0
      const price = typeof plan.price === 'number' ? plan.price : 0;
      return total + price;
    }, 0); // Nilai awal total adalah 0
  }

  // Jika tidak ada listPlan, tampilkan harga default (yang mungkin 0)
  return packageData.value?.price || 0;
});

onMounted(fetchPackage);
</script>

<template>
  <BContainer>
    <div v-if="isLoading" class="text-center mt-5"><BSpinner /></div>
    <BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>

    <div v-else-if="packageData">

      <BButton
        variant="outline-secondary"
        to="/packages"
        class="mb-3"
      >
        &larr; Back to Packages List
      </BButton>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">{{ packageData.packageName }}</h1>
        <div v-if="packageData.status === 'Pending'">
          <BButton variant="secondary" @click="enterEditMode">Edit Package</BButton>
          <BButton variant="danger" class="ms-2" @click="showDeleteModal = true">Delete Package</BButton>
          <BButton variant="success" class="ms-2" @click="showProcessModal = true">Process Package</BButton>
        </div>
      </div>

      <BCard v-if="!isEditMode" header="Package Information" class="mb-4">
        <BRow>
          <BCol md="4"><p class="mb-2"><strong>Package Name:</strong></p><p>{{ packageData.packageName }}</p></BCol>
          <BCol md="4"><p class="mb-2"><strong>User ID:</strong></p><p>{{ packageData.userId }}</p></BCol>
          <BCol md="4"><p class="mb-2"><strong>Start Date:</strong></p><p>{{ new Date(packageData.startDate).toLocaleDateString() }}</p></BCol>
          <BCol md="4" class="mt-3"><p class="mb-2"><strong>End Date:</strong></p><p>{{ new Date(packageData.endDate).toLocaleDateString() }}</p></BCol>
          <BCol md="4" class="mt-3"><p class="mb-2"><strong>Quota:</strong></p><p>{{ packageData.quota }}</p></BCol>
          <BCol md="4" class="mt-3"><p class="mb-2"><strong>Status:</strong></p><BBadge :variant="packageData.status === 'Pending' ? 'warning' : 'success'">{{ packageData.status }}</BBadge></BCol>
          <BCol md="4" class="mt-3"><p class="mb-2"><strong>Status:</strong></p><BBadge :variant="packageData.status === 'Pending' ? 'warning' : 'success'">{{ packageData.status }}</BBadge></BCol>
          <BCol md="12" class="mt-3"><p class="mb-2"><strong>Total Price:</strong></p><p class="h5">Rp {{ new Intl.NumberFormat('id-ID').format(totalPackagePrice) }}</p></BCol>
        </BRow>
      </BCard>
      <BCard v-else header="Edit Package" class="mb-4">
        <BForm @submit.prevent="handleUpdate">
          <BFormGroup label="Package Name:" label-for="packageName" class="mb-3"><BFormInput id="packageName" v-model="editFormData.packageName" required /></BFormGroup>
          <BFormGroup label="Quota:" label-for="quota" class="mb-3"><BFormInput id="quota" v-model="editFormData.quota" type="number" required /></BFormGroup>
          <BFormGroup label="Start Date:" label-for="startDate" class="mb-3"><BFormInput id="startDate" v-model="editFormData.startDate" type="datetime-local" required /></BFormGroup>
          <BFormGroup label="End Date:" label-for="endDate" class="mb-3"><BFormInput id="endDate" v-model="editFormData.endDate" type="datetime-local" required /></BFormGroup>
          <div class="mt-4">
            <BButton type="submit" variant="primary">Save Changes</BButton>
            <BButton variant="secondary" class="ms-2" @click="isEditMode = false">Cancel</BButton>
          </div>
        </BForm>
      </BCard>

      <BCard>
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <span class="h5 mb-0">Plans for Package</span>
            <BButton variant="success" size="sm" @click="showPlanModal = true" :disabled="packageData.status !== 'Pending'">+ Create New Plan</BButton>
          </div>
        </template>
        <BTable :items="packageData.listPlan" :fields="planFields" striped hover responsive>
          <template #cell(price)="data">Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price) }}</template>
          <template #cell(status)="data"><BBadge :variant="data.item.status === 'Fulfilled' ? 'success' : 'warning'">{{ data.item.status }}</BBadge></template>
          <template #cell(actions)="data">
            <BButton size="sm" variant="info" :to="{ name: 'plan-detail', params: { id: data.item.id } }">View</BButton>
            <BButton size="sm" variant="danger" class="ms-2" @click="openDeletePlanConfirmation(data.item)" :disabled="packageData.status !== 'Pending'">Delete</BButton>
          </template>
        </BTable>
        <p v-if="!packageData.listPlan || packageData.listPlan.length === 0" class="text-muted">No plans have been added to this package yet.</p>
      </BCard>

    </div>
    <BModal v-model="showDeleteModal" title="Confirm Package Deletion" @ok="handleDelete">Are you sure you want to delete this package?</BModal>
    <BModal v-model="showProcessModal" title="Confirm Package Process" @ok="handleProcess">Are you sure you want to process this package?</BModal>
    <BModal v-model="showPlanModal" title="Create New Plan" footer-class="d-none">
      <BForm @submit.prevent="handleCreatePlan">
        <BFormGroup label="Plan Name:"><BFormInput v-model="planForm.planName" required /></BFormGroup>
        <BFormGroup label="Activity Type:" class="mt-3"><BFormSelect v-model="planForm.activityType" :options="activityTypes" required /></BFormGroup>
        <BFormGroup label="Start Date:" class="mt-3"><BFormInput v-model="planForm.startDate" type="datetime-local" required /></BFormGroup>
        <BFormGroup label="End Date:" class="mt-3"><BFormInput v-model="planForm.endDate" type="datetime-local" required /></BFormGroup>
        <BFormGroup label="Start Location:" class="mt-3"><BFormSelect v-model="planForm.startLocation" :options="locations" required /></BFormGroup>
        <BFormGroup label="End Location:" class="mt-3"><BFormSelect v-model="planForm.endLocation" :options="locations" required /></BFormGroup>
        <div class="d-flex justify-content-end mt-4">
          <BButton variant="secondary" @click="showPlanModal = false">Cancel</BButton>
          <BButton type="submit" variant="primary" class="ms-2">Create Plan</BButton>
        </div>
      </BForm>
    </BModal>
    <BModal v-model="showDeletePlanModal" title="Confirm Plan Deletion" @ok="handleDeletePlan">Are you sure you want to delete the plan "{{ planToDelete?.planName }}"?</BModal>

  </BContainer>
</template>
