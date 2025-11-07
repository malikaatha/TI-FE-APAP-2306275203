<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPlanById } from '@/services/plan.service';
import { getFilteredActivities } from '@/services/activity.service';
import { addActivityToPlan, removeActivityFromPlan } from '@/services/orderedQuantity.service';
import {
  BContainer, BCard, BRow, BCol, BButton, BAlert, BSpinner, BTable, BBadge,
  BForm, BFormGroup, BFormInput, BFormSelect, BModal
} from 'bootstrap-vue-next';

const route = useRoute();
const planId = route.params.id as string;

const planData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const availableActivities = ref<any[]>([]);
const addActivityForm = reactive({ activityId: null, orderedQuota: 1 });
const showAddActivityModal = ref(false);

const oqToDelete = ref<any>(null);
const showDeleteOQModal = ref(false);

const fetchPlan = async () => {
  try {
    isLoading.value = true;
    planData.value = await getPlanById(planId);
  } catch (err) {
    error.value = 'Failed to load plan details.';
  } finally {
    isLoading.value = false;
  }
};

const openAddActivityModal = async () => {
  try {
    availableActivities.value = await getFilteredActivities(planId);
    showAddActivityModal.value = true;
  } catch (err) {
    alert('Could not fetch available activities.');
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
    fetchPlan();
  } catch (err: any) {
    alert(`Failed to add activity: ${err.response?.data || err.message}`);
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
  { key: 'activityId', label: 'Activity ID' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'price', label: 'Price' },
  { key: 'orderedQuota', label: 'Ordered Quota' },
  { key: 'total', label: 'Total' }
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

onMounted(fetchPlan);
</script>

<template>
  <BContainer>
    <div v-if="isLoading" class="text-center mt-5"><BSpinner /></div>
    <BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>
    <div v-else-if="planData">
      <h1 class="h3 mb-4">View Plan</h1>

      <BCard header="Plan Information" class="mb-4">
        <BRow>
          <BCol md="6">
            <p class="mb-2"><strong>Plan Name:</strong></p>
            <p>{{ planData.planName }}</p>

            <p class="mb-2 mt-3"><strong>Plan Status:</strong></p>
            <BBadge :variant="planData.status === 'Fulfilled' ? 'success' : 'warning'">{{ planData.status }}</BBadge>
            <p class="small text-muted" v-if="planData.status === 'Fulfilled'">All requirements met</p>

            <p class="mb-2 mt-3"><strong>Start Date:</strong></p>
            <p>{{ new Date(planData.startDate).toLocaleString() }}</p>

            <p class="mb-2 mt-3"><strong>Start Location:</strong></p>
            <p>{{ planData.startLocation }}</p>

            <p class="mb-2 mt-3"><strong>Package:</strong></p>
            <RouterLink :to="{ name: 'package-detail', params: { id: planData.packageId } }">
              {{ planData.packageId }} <!-- Idealnya ini nama package, tapi ID cukup -->
            </RouterLink>
          </BCol>
          <BCol md="6">
            <p class="mb-2"><strong>Activity Type:</strong></p>
            <p>{{ planData.activityType }}</p>

            <p class="mb-2 mt-3"><strong>Total Price:</strong></p>
            <p class="h5">Rp {{ new Intl.NumberFormat('id-ID').format(planData.price) }}</p>

            <p class="mb-2 mt-3"><strong>End Date:</strong></p>
            <p>{{ new Date(planData.endDate).toLocaleString() }}</p>

            <p class="mb-2 mt-3"><strong>End Location:</strong></p>
            <p>{{ planData.endLocation }}</p>
          </BCol>
        </BRow>
        <template #footer>
          <BButton variant="secondary" :to="`/packages/${planData.packageId}`">View Package</BButton>
          <BButton variant="warning" class="ms-2">Edit Plan</BButton>
          <BButton variant="danger" class="ms-2">Delete Plan</BButton>
        </template>
      </BCard>

      <BCard header="Ordered Activities">
        <BTable :items="planData.listOrderedQuantity" :fields="oqFields" striped hover responsive>
          <template #cell(activityId)="data">{{ data.item.activityId }}</template>
          <template #cell(startDate)="data">{{ new Date(data.item.startDate).toLocaleString() }}</template>
          <template #cell(endDate)="data">{{ new Date(data.item.endDate).toLocaleString() }}</template>
          <template #cell(price)="data">Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price) }}</template>
          <template #cell(total)="data">Rp {{ new Intl.NumberFormat('id-ID').format(data.item.price * data.item.orderedQuota) }}</template>
        </BTable>
      </BCard>
    </div>
  </BContainer>
</template>
