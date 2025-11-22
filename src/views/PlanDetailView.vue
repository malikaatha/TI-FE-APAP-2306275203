<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPlanById, updatePlan } from '@/services/plan.service';
import { getFilteredActivities} from '@/services/activity.service';
import { addActivityToPlan, updateOrderedQuantity, removeActivityFromPlan } from '@/services/orderedQuantity.service';
import {
  BContainer, BCard, BRow, BCol, BButton, BAlert, BSpinner, BTable, BBadge,
  BForm, BFormGroup, BFormInput, BFormSelect, BModal
} from 'bootstrap-vue-next';

const route = useRoute();
const planId = route.params.id as string;

const planData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const isEditMode = ref(false);
const editForm = reactive({ planName: '', startDate: '', endDate: '', startLocation: '', endLocation: '' });
const locations = ['DKI Jakarta (Provinsi)', 'Bali (Provinsi)', 'Jawa Barat (Provinsi)', 'Yogyakarta (Provinsi)'];

const showOQModal = ref(false);
const isEditingOQ = ref(false);
const oqForm = reactive({ id: '', activityId: null, orderedQuota: 1 });
const availableActivities = ref<any[]>([]);
const selectedActivityDetails = computed(() => {
  if (!oqForm.activityId) return null;
  return availableActivities.value.find(act => act.id === oqForm.activityId);
});
const oqModalTitle = computed(() => isEditingOQ.value ? 'Edit Ordered Activity' : 'Add Activity to Plan');

const oqToDelete = ref<any>(null);
const showDeleteOQModal = ref(false);

const fetchPlan = async () => {
  try {
    isLoading.value = true;
    const data = await getPlanById(planId);
    planData.value = data;

    if (data) {
      editForm.planName = data.planName;
      editForm.startDate = data.startDate.slice(0, 16);
      editForm.endDate = data.endDate.slice(0, 16);
      editForm.startLocation = data.startLocation;
      editForm.endLocation = data.endLocation;
    }

  } catch (err) {
    error.value = 'Failed to load plan details.';
  } finally {
    isLoading.value = false;
  }
};

const enterEditMode = () => {
  if (planData.value) {
    Object.assign(editForm, {
      planName: planData.value.planName,
      startDate: planData.value.startDate.slice(0, 16),
      endDate: planData.value.endDate.slice(0, 16),
      startLocation: planData.value.startLocation,
      endLocation: planData.value.endLocation
    });
    isEditMode.value = true;
  }
};

const handleUpdatePlan = async () => {
  try {
    await updatePlan(planId, editForm);
    isEditMode.value = false;
    fetchPlan();
  } catch (err: any) {
    alert(`Update failed: ${err.response?.data || err.message}`);
  }
};

const openAddActivityModal = async () => {
  isEditingOQ.value = false;
  Object.assign(oqForm, { id: '', activityId: null, orderedQuota: 1 });
  try {
    availableActivities.value = await getFilteredActivities(planId);
    showOQModal.value = true;
  } catch (err) {
    alert('Could not fetch available activities.');
  }
};

const openEditOQModal = (oq: any) => {
  isEditingOQ.value = true;
  Object.assign(oqForm, { id: oq.id, activityId: oq.activityId, orderedQuota: oq.orderedQuota });
  availableActivities.value = [{
    id: oq.activityId,
    activityName: oq.activityName,
    price: oq.price,
    capacity: oq.capacity
  }];
  showOQModal.value = true;
};

const handleSubmitOQ = async () => {
  try {
    if (isEditingOQ.value) {
      await updateOrderedQuantity(oqForm.id, { orderedQuota: oqForm.orderedQuota });
    } else {
      if (!oqForm.activityId) {
        alert('Please select an activity.');
        return;
      }
      await addActivityToPlan(planId, { activityId: oqForm.activityId, orderedQuota: oqForm.orderedQuota });
    }
    showOQModal.value = false;
    fetchPlan();
  } catch (err: any) {
    alert(`Failed: ${err.response?.data || err.message}`);
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
    fetchPlan();
  } catch (err: any) {
    alert(`Failed to remove activity: ${err.response?.data || err.message}`);
  }
};

const oqFields = [
  { key: 'activityName', label: 'Activity Name' },
  { key: 'price', label: 'Price' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'orderedQuota', label: 'Ordered Quota' },
  { key: 'total', label: 'Total Price' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'actions', label: 'Actions' }
];

const availableActivitiesOptions = computed(() => {
  if (!availableActivities.value) return [];
  return [
    { value: null, text: 'Select an activity' },
    ...availableActivities.value.map(act => ({
      value: act.id,
      text: `${act.activityName} - (Rp ${act.price})`
    }))
  ];
});

onMounted(fetchPlan);
</script>

<template>
  <BContainer>
    <div v-if="isLoading" class="text-center mt-5"><BSpinner /></div>
    <BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>
    <div v-else-if="planData">
      <BButton variant="outline-secondary" :to="`/packages/${planData.packageId}`" class="mb-3">&larr; Back to Package</BButton>

      <h1 class="h3 mb-4">Edit Plan</h1>
      <BCard header="Plan Information" class="mb-4">
        <BForm @submit.prevent="handleUpdatePlan">
          <BRow>
            <BCol md="12" class="mb-3">
              <BFormGroup label="Plan Name *">
                <BFormInput v-model="editForm.planName" :disabled="!isEditMode" />
              </BFormGroup>
            </BCol>
            <BCol md="4" class="mb-3">
              <label>Activity Type</label>
              <p class="form-control-plaintext">{{ planData.activityType }}</p>
            </BCol>
            <BCol md="4" class="mb-3">
              <label>Plan Status</label>
              <div>
                <BBadge :variant="planData.status === 'Fulfilled' ? 'success' : 'warning'">{{ planData.status }}</BBadge>
              </div>
            </BCol>
            <BCol md="4" class="mb-3">
              <label>Total Price</label>
              <p class="form-control-plaintext h5">Rp {{ new Intl.NumberFormat('id-ID').format(planData.price) }}</p>
            </BCol>
            <BCol md="6" class="mb-3">
              <BFormGroup label="Start Date *">
                <BFormInput v-model="editForm.startDate" type="datetime-local" :disabled="!isEditMode" />
              </BFormGroup>
            </BCol>
            <BCol md="6" class="mb-3">
              <BFormGroup label="End Date *">
                <BFormInput v-model="editForm.endDate" type="datetime-local" :disabled="!isEditMode" />
              </BFormGroup>
            </BCol>
            <BCol md="6" class="mb-3">
              <BFormGroup label="Start Location *">
                <BFormSelect v-model="editForm.startLocation" :options="locations" :disabled="!isEditMode" />
              </BFormGroup>
            </BCol>
            <BCol md="6" class="mb-3">
              <BFormGroup label="End Location *">
                <BFormSelect v-model="editForm.endLocation" :options="locations" :disabled="!isEditMode" />
              </BFormGroup>
            </BCol>
          </BRow>
          <BAlert variant="info" show v-if="planData.listOrderedQuantity && planData.listOrderedQuantity.length > 0">
            Plan details cannot be edited because this plan has ordered activities. Remove all activities first to edit the plan.
          </BAlert>
          <div v-if="isEditMode" class="mt-3">
            <BButton type="submit" variant="primary">Update Plan</BButton>
            <BButton variant="secondary" class="ms-2" @click="isEditMode = false">Cancel</BButton>
          </div>
          <div v-else>
             <BButton variant="warning" @click="enterEditMode" :disabled="planData.listOrderedQuantity && planData.listOrderedQuantity.length > 0">Edit Plan</BButton>
          </div>
        </BForm>
      </BCard>

      <BCard header="Ordered Activities">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <span>Ordered Activities</span>
            <BButton variant="success" size="sm" @click="openAddActivityModal">+ Add Activity</BButton>
          </div>
        </template>
        <BTable :items="planData.listOrderedQuantity" :fields="oqFields" striped hover v-if="planData.listOrderedQuantity && planData.listOrderedQuantity.length > 0">
          <template #cell(price)="data">Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price) }}</template>
          <template #cell(total)="data">Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price * data.item.orderedQuota) }}</template>
          <template #cell(startDate)="data">{{ new Date(data.item.startDate).toLocaleString() }}</template>
          <template #cell(endDate)="data">{{ new Date(data.item.endDate).toLocaleString() }}</template>
          <template #cell(actions)="data">
            <BButton size="sm" variant="warning" @click="openEditOQModal(data.item)">Edit</BButton>
            <BButton size="sm" variant="danger" class="ms-2" @click="confirmDeleteOQ(data.item)">Remove</BButton>
          </template>
        </BTable>
        <p v-else class="text-muted">No activities added to this plan yet.</p>
      </BCard>
    </div>

    <BModal v-model="showOQModal" :title="oqModalTitle" footer-class="d-none">
      <BForm @submit.prevent="handleSubmitOQ">
        <BFormGroup label="Activity *">
          <BFormSelect v-model="oqForm.activityId" :options="availableActivitiesOptions" required :disabled="isEditingOQ" />
        </BFormGroup>
        <div v-if="selectedActivityDetails" class="mt-3 p-3 bg-light border rounded">
          <small>
            <strong>Selected Activity Details:</strong><br>
            Name: {{ selectedActivityDetails.activityName }}<br>
            Price: Rp {{ selectedActivityDetails.price }}<br>
            Capacity: {{ selectedActivityDetails.capacity }}
          </small>
        </div>
        <BFormGroup label="Ordered Quantity *" class="mt-3">
          <BFormInput v-model="oqForm.orderedQuota" type="number" min="1" required />
        </BFormGroup>
        <div class="d-flex justify-content-end mt-4">
          <BButton variant="secondary" @click="showOQModal = false">Cancel</BButton>
          <BButton type="submit" variant="primary" class="ms-2">{{ isEditingOQ ? 'Update Activity' : 'Add Activity' }}</BButton>
        </div>
      </BForm>
    </BModal>

    <BModal v-model="showDeleteOQModal" title="Confirm Removal" @ok="handleDeleteOQ">
      Are you sure you want to remove "{{ oqToDelete?.activityName }}" from this plan?
    </BModal>
  </BContainer>
</template>
