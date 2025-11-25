<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getAllActivities, deleteActivity, LOCATION_OPTIONS, ACTIVITY_TYPES } from '@/services/activity.service';
import type { Activity, ActivityFilter } from '@/interfaces/activity.interface';
import {
  BContainer, BRow, BCol, BCard, BButton, BFormInput, BFormSelect, BFormCheckbox,
  BTable, BBadge, BSpinner, BAlert, BModal, BFormGroup
} from 'bootstrap-vue-next';

const router = useRouter();

const activities = ref<Activity[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const currentRole = ref('Superadmin');
const roles = ['Superadmin', 'Vendor Tour Package', 'Vendor Flight', 'Vendor Accommodation', 'Vendor Vehicle Rental'];

const filters = reactive<ActivityFilter>({
  showDeleted: false,
  activityType: null,
  startLocation: null,
  endLocation: null,
  startDate: null,
  endDate: null,
  searchQuery: ''
});

const showDeleteModal = ref(false);
const activityToDelete = ref<Activity | null>(null);
const isDeleting = ref(false);

const fetchActivities = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    activities.value = await getAllActivities();
  } catch (err: any) {
    error.value = "Failed to load activities.";
  } finally {
    isLoading.value = false;
  }
};

const filteredActivities = computed(() => {
  let result = activities.value;

  if (!filters.showDeleted) {
    result = result.filter(a => !a.isDeleted);
  }

  if (filters.activityType) {
    result = result.filter(a => a.activityType === filters.activityType);
  }

  if (filters.startLocation) result = result.filter(a => a.startLocation === filters.startLocation);
  if (filters.endLocation) result = result.filter(a => a.endLocation === filters.endLocation);

  if (filters.startDate) result = result.filter(a => new Date(a.startDate) >= new Date(filters.startDate!));
  if (filters.endDate) result = result.filter(a => new Date(a.endDate) <= new Date(filters.endDate!));

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(a =>
      a.activityName.toLowerCase().includes(query) ||
      a.activityItem.toLowerCase().includes(query)
    );
  }

  return result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
});

const goCreate = () => router.push({ name: 'activity-create', query: { role: currentRole.value } });
const goDetail = (id: string) => router.push({ name: 'activity-detail', params: { id } });
const goEdit = (id: string) => router.push({ name: 'activity-edit', params: { id }, query: { role: currentRole.value } });

const confirmDelete = (activity: Activity) => {
  activityToDelete.value = activity;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!activityToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteActivity(activityToDelete.value.id);
    successMessage.value = "Activity deleted successfully.";
    showDeleteModal.value = false;
    fetchActivities();
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to delete activity. It might be in use.";
    showDeleteModal.value = false;
  } finally {
    isDeleting.value = false;
  }
};

const fields = [
  { key: 'activityName', label: 'Name', sortable: true },
  { key: 'activityType', label: 'Type' },
  { key: 'startLocation', label: 'Start Loc' },
  { key: 'startDate', label: 'Start Date', formatter: (val: string) => new Date(val).toLocaleString() },
  { key: 'price', label: 'Price', formatter: (val: number) => `Rp ${val.toLocaleString()}` },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
];

onMounted(fetchActivities);
</script>

<template>
  <BContainer>
    <BCard class="mb-3 bg-light border-0 py-2">
      <div class="d-flex align-items-center">
        <strong class="me-2">🕵️ Role Simulator:</strong>
        <BFormSelect v-model="currentRole" :options="roles" size="sm" style="max-width: 250px;" />
      </div>
    </BCard>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Activity List</h1>
      <BButton variant="primary" @click="goCreate">+ Create New Activity</BButton>
    </div>

    <BAlert v-if="error" variant="danger" :model-value="!!error" dismissible @close="error = null">{{ error }}</BAlert>
    <BAlert v-if="successMessage" variant="success" :model-value="!!successMessage" dismissible @close="successMessage = null">{{ successMessage }}</BAlert>

    <BCard class="mb-4">
      <BRow class="g-3">
        <BCol md="4">
          <BFormInput v-model="filters.searchQuery" placeholder="Search Activity Name/Item..." />
        </BCol>
        <BCol md="3">
          <BFormSelect v-model="filters.activityType" :options="[{ value: null, text: 'All Types' }, ...ACTIVITY_TYPES]" />
        </BCol>
        <BCol md="3">
          <BFormSelect v-model="filters.startLocation" :options="[{ value: null, text: 'All Start Locations' }, ...LOCATION_OPTIONS]" />
        </BCol>
        <BCol md="2" class="d-flex align-items-center">
          <BFormCheckbox v-if="currentRole === 'Superadmin'" v-model="filters.showDeleted" switch>
            Show Deleted
          </BFormCheckbox>
        </BCol>

      </BRow>
    </BCard>

    <div v-if="isLoading" class="text-center py-5"><BSpinner /></div>

    <div v-else>
      <BTable :items="filteredActivities" :fields="fields" striped hover responsive>
        <template #cell(status)="data">
          <BBadge v-if="data.item.isDeleted" variant="danger">Deleted</BBadge>
          <BBadge v-else variant="success">Active</BBadge>
        </template>

        <template #cell(actions)="data">
          <div class="d-flex gap-1">
            <BButton size="sm" variant="info" @click="goDetail(data.item.id)">View</BButton>

            <BButton
              size="sm"
              variant="warning"
              @click="goEdit(data.item.id)"
              :disabled="data.item.isDeleted"
            >
              Edit
            </BButton>
            <BButton
              size="sm"
              variant="danger"
              @click="confirmDelete(data.item)"
              :disabled="data.item.isDeleted"
            >
              Delete
            </BButton>
          </div>
        </template>
      </BTable>

      <div v-if="filteredActivities.length === 0" class="text-center text-muted mt-4">
        <h4>No activities found</h4>
        <p>Try adjusting your search or filters.</p>
      </div>
    </div>

    <BModal
      v-model="showDeleteModal"
      title="Confirm Activity Deletion"
      ok-variant="danger"
      ok-title="Delete"
      :ok-disabled="isDeleting"
      @ok="handleDelete"
    >
      <p>Are you sure you want to delete <strong>{{ activityToDelete?.activityName }}</strong>?</p>
      <small class="text-danger">This action cannot be undone immediately (Soft Delete).</small>
    </BModal>

  </BContainer>
</template>
