<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPlanById, updatePlan } from '@/services/plan.service';
import { getPackageById } from '@/services/package.service';
import { getFilteredActivities } from '@/services/activity.service';
import { addActivityToPlan, updateOrderedQuantity, removeActivityFromPlan } from '@/services/orderedQuantity.service';
import {
  BContainer, BCard, BRow, BCol,
  BButton, BAlert, BSpinner, BTable,
  BForm, BFormGroup, BFormInput, BFormSelect, BModal, BCardText
} from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();
const planId = route.params.id as string;

const planData = ref<any>(null);
const packageData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const editPlanForm = reactive({
  planName: '',
  startDate: '',
  endDate: '',
  startLocation: null,
  endLocation: null
});

const locations = [
  { value: null, text: 'Please select a location' },
  { value: 'Jakarta (Provinsi)', text: 'Jakarta (Provinsi)' },
  { value: 'Bali (Provinsi)', text: 'Bali (Provinsi)' },
  { value: 'Jawa Barat (Provinsi)', text: 'Jawa Barat (Provinsi)' },
  { value: 'Kota Denpasar', text: 'Kota Denpasar' }
];

const availableActivities = ref<any[]>([]);
const addActivityForm = reactive({ activityId: null, orderedQuota: 1 });
const showAddActivityModal = ref(false);

const oqToEdit = reactive<any>({ id: null, activityName: '', orderedQuota: 1 });
const showEditOQModal = ref(false);

const oqToDelete = ref<any>(null);
const showDeleteOQModal = ref(false);

const isPlanFormDisabled = computed(() => {
  return packageData.value?.status !== 'Pending' || (planData.value?.listOrderedQuantity && planData.value.listOrderedQuantity.length > 0);
});

const fetchPlanAndPackage = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const planResponse = await getPlanById(planId);
    planData.value = planResponse.data; // Sesuaikan jika perlu

    const packageResponse = await getPackageById(planData.value.packageId);
    packageData.value = packageResponse.data; // Sesuaikan jika perlu

    editPlanForm.planName = planData.value.planName;
    editPlanForm.startDate = planData.value.startDate.slice(0, 16);
    editPlanForm.endDate = planData.value.endDate.slice(0, 16);
    editPlanForm.startLocation = planData.value.startLocation;
    editPlanForm.endLocation = planData.value.endLocation;

  } catch (err: any) {
    error.value = `Failed to load data: ${err.response?.data?.message || err.message}`;
  } finally {
    isLoading.value = false;
  }
};

const handleUpdatePlan = async () => {
  try {
    await updatePlan(planId, editPlanForm);
    alert('Plan details updated!');
    fetchPlanAndPackage();
  } catch (err: any) {
    alert(`Failed to update plan: ${err.response?.data?.message || err.message}`);
  }
};

const openAddActivityModal = async () => {
  try {
    const response = await getFilteredActivities(planId);
    availableActivities.value = response.data; // Sesuaikan jika perlu
    showAddActivityModal.value = true;
  } catch (err: any) {
    alert(`Could not fetch available activities: ${err.response?.data?.message || err.message}`);
  }
};

const handleAddActivity = async () => {
  if (!addActivityForm.activityId) {
    alert('Please select an activity.');
    return;
  }
  try {
    await addActivityToPlan(planId, addActivityForm);
    showAddActivityModal.value = false;
    addActivityForm.activityId = null;
    addActivityForm.orderedQuota = 1;
    fetchPlanAndPackage();
  } catch (err: any) {
    alert(`Failed to add activity: ${err.response?.data?.message || err.message}`);
  }
};

const openEditOQModal = (oq: any) => {
  oqToEdit.id = oq.id;
  oqToEdit.activityName = oq.activityName;
  oqToEdit.orderedQuota = oq.orderedQuota;
  showEditOQModal.value = true;
};

const handleUpdateOQ = async () => {
  try {
    await updateOrderedQuantity(oqToEdit.id, { orderedQuota: oqToEdit.orderedQuota });
    showEditOQModal.value = false;
    fetchPlanAndPackage();
  } catch (err: any) {
    alert(`Failed to update quantity: ${err.response?.data?.message || err.message}`);
  }
};

const confirmDeleteOQ = (oq: any) => {
  oqToDelete.value = oq;
  showDeleteOQModal.value = true;
};

const handleDeleteOQ = async () => {
  if (!oqToDelete.value) return;
  try {
    await removeActivityFromPlan(oqToDelete.value.id);
    showDeleteOQModal.value = false;
    oqToDelete.value = null;
    fetchPlanAndPackage();
  } catch (err: any) {
    alert(`Failed to remove activity: ${err.response?.data?.message || err.message}`);
  }
};

const oqFields = [
  { key: 'activityName', label: 'Activity Name' },
  { key: 'orderedQuota', label: 'Qty' },
  { key: 'price', label: 'Price/Unit' },
  { key: 'total', label: 'Total Price' },
  { key: 'actions', label: 'Actions' }
];

const availableActivitiesOptions = computed(() => {
  if (!availableActivities.value) return [];
  return [
    { value: null, text: 'Select an activity' },
    ...availableActivities.value.map(act => ({
      value: act.id,
      text: `${act.activityName} (Price: ${act.price}, Capacity: ${act.capacity})`
    }))
  ];
});

onMounted(fetchPlanAndPackage);
</script>

<template>
  <BContainer class="my-4">
    <div v-if="isLoading" class="text-center mt-5">
      <BSpinner label="Loading..." />
    </div>

    <BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>

    <div v-else-if="planData">
      <BButton variant="outline-secondary" :to="{ name: 'plan-detail', params: { id: planId } }" class="mb-3">
        &larr; Back to Plan Details
      </BButton>

      <BCard header="Edit Plan Information">
        <BForm @submit.prevent="handleUpdatePlan">
          <BRow>
            <BCol md="6">
              <BFormGroup label="Plan Name:" label-for="planName">
                <BFormInput id="planName" v-model="editPlanForm.planName" :disabled="isPlanFormDisabled" required />
              </BFormGroup>
            </BCol>
            <BCol md="6">
              <BFormGroup label="Activity Type (Read-only):" label-for="activityType">
                <BFormInput id="activityType" :value="planData.activityType" readonly disabled />
              </BFormGroup>
            </BCol>
          </BRow>

          <BRow class="mt-3">
            <BCol md="6">
              <BFormGroup label="Start Date:" label-for="planStartDate">
                <BFormInput id="planStartDate" v-model="editPlanForm.startDate" type="datetime-local" :disabled="isPlanFormDisabled" required />
              </BFormGroup>
            </BCol>
            <BCol md="6">
              <BFormGroup label="End Date:" label-for="planEndDate">
                <BFormInput id="planEndDate" v-model="editPlanForm.endDate" type="datetime-local" :disabled="isPlanFormDisabled" required />
              </BFormGroup>
            </BCol>
          </BRow>

          <BRow class="mt-3">
            <BCol md="6">
              <BFormGroup label="Start Location:" label-for="planStartLocation">
                <BFormSelect id="planStartLocation" v-model="editPlanForm.startLocation" :options="locations" :disabled="isPlanFormDisabled" required />
              </BFormGroup>
            </BCol>
            <BCol md="6">
              <BFormGroup label="End Location:" label-for="planEndLocation">
                <BFormSelect id="planEndLocation" v-model="editPlanForm.endLocation" :options="locations" :disabled="isPlanFormDisabled" required />
              </BFormGroup>
            </BCol>
          </BRow>

          <div class="mt-4">
            <BButton type="submit" variant="primary" :disabled="isPlanFormDisabled">Save Plan Changes</BButton>
            <BAlert v-if="isPlanFormDisabled" variant="warning" class="mt-3" show>
              Plan details cannot be edited. Editing is only allowed when the package status is "Pending" and the plan has no ordered activities.
            </BAlert>
          </div>
        </BForm>
      </BCard>

      <BCard title="Manage Ordered Activities" class="mt-4">
        <div class="d-flex justify-content-end mb-3">
          <BButton
            variant="success"
            @click="openAddActivityModal"
            :disabled="packageData.status !== 'Pending'"
            title="Can only add activities if package is 'Pending'"
          >
            + Add Activity
          </BButton>
        </div>
        <BTable :items="planData.listOrderedQuantity" :fields="oqFields" striped hover responsive>
          <template #cell(price)="data">
            Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price) }}
          </template>
          <template #cell(total)="data">
            Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price * data.item.orderedQuota) }}
          </template>
          <template #cell(actions)="data">
            <BButton
              size="sm"
              variant="warning"
              @click="openEditOQModal(data.item)"
              :disabled="packageData.status !== 'Pending'"
            >
              Edit
            </BButton>
            <BButton
              size="sm"
              variant="danger"
              class="ms-2"
              @click="confirmDeleteOQ(data.item)"
              :disabled="packageData.status !== 'Pending'"
            >
              Remove
            </BButton>
          </template>
        </BTable>
         <BCardText v-if="!planData.listOrderedQuantity || planData.listOrderedQuantity.length === 0">
          No activities have been ordered for this plan yet.
        </BCardText>
      </BCard>
    </div>

    <BModal v-model="showAddActivityModal" title="Add Activity to Plan" footer-class="d-none">
      <BForm @submit.prevent="handleAddActivity">
        <BFormGroup label="Available Activities:">
          <BFormSelect v-model="addActivityForm.activityId" :options="availableActivitiesOptions" required />
        </BFormGroup>
        <BFormGroup label="Quantity:" class="mt-3">
          <BFormInput v-model="addActivityForm.orderedQuota" type="number" min="1" required />
        </BFormGroup>
        <div class="d-flex justify-content-end mt-4">
          <BButton variant="secondary" @click="showAddActivityModal = false">Cancel</BButton>
          <BButton type="submit" variant="primary" class="ms-2">Add to Plan</BButton>
        </div>
      </BForm>
    </BModal>

    <BModal v-model="showEditOQModal" title="Edit Ordered Activity" footer-class="d-none">
      <BForm @submit.prevent="handleUpdateOQ">
        <BFormGroup label="Activity Name:">
          <BFormInput :value="oqToEdit.activityName" readonly disabled />
        </BFormGroup>
        <BFormGroup label="Quantity:" class="mt-3">
          <BFormInput v-model="oqToEdit.orderedQuota" type="number" min="1" required />
        </BFormGroup>
        <div class="d-flex justify-content-end mt-4">
          <BButton variant="secondary" @click="showEditOQModal = false">Cancel</BButton>
          <BButton type="submit" variant="primary" class="ms-2">Save Changes</BButton>
        </div>
      </BForm>
    </BModal>

    <BModal v-model="showDeleteOQModal" title="Confirm Removal" @ok="handleDeleteOQ" ok-title="Yes, Remove" ok-variant="danger" cancel-title="Cancel">
      Are you sure you want to remove "{{ oqToDelete?.activityName }}" from this plan?
    </BModal>

  </BContainer>
</template>
