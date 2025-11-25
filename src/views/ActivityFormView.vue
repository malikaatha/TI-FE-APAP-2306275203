<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createActivity, getActivityById, updateActivity, LOCATION_OPTIONS, ACTIVITY_TYPES } from '@/services/activity.service';
import {
  BContainer, BCard, BForm, BFormGroup, BFormInput, BFormSelect, BButton, BAlert, BSpinner, BRow, BCol
} from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();

const activityId = route.params.id as string;
const isEditMode = computed(() => !!activityId);
const currentRole = (route.query.role as string) || 'Superadmin';

const form = reactive({
  activityName: '',
  activityType: null as string | null,
  price: 0,
  capacity: 1,
  startLocation: null as string | null,
  endLocation: null as string | null,
  startDate: '',
  endDate: '',
  activityItem: ''
});

const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref<string | null>(null);

const allowedTypes = computed(() => {
  if (currentRole === 'Vendor Flight') return ['Flight'];
  if (currentRole === 'Vendor Accommodation') return ['Accommodation'];
  if (currentRole === 'Vendor Vehicle Rental') return ['Vehicle Rental'];
  return ACTIVITY_TYPES;
});

onMounted(async () => {
  if (isEditMode.value) {
    isLoading.value = true;
    try {
      const data = await getActivityById(activityId);
      form.activityName = data.activityName;
      form.activityType = data.activityType;
      form.price = data.price;
      form.capacity = data.capacity;
      form.startLocation = data.startLocation;
      form.endLocation = data.endLocation;
      form.startDate = data.startDate.slice(0, 16);
      form.endDate = data.endDate.slice(0, 16);
      form.activityItem = data.activityItem;
    } catch (err) {
      error.value = "Failed to load activity data.";
    } finally {
      isLoading.value = false;
    }
  }
});

const validateForm = () => {
  if (!form.activityName || !form.activityType || !form.startLocation || !form.endLocation || !form.activityItem) {
    return "All fields are required.";
  }
  if (form.price <= 0) return "Price must be greater than 0.";
  if (form.capacity <= 0) return "Capacity must be greater than 0.";

  const start = new Date(form.startDate);
  const end = new Date(form.endDate);
  const now = new Date();

  if (start < now && !isEditMode.value) return "Start Date cannot be in the past.";
  if (start >= end) return "Start Date must be before End Date.";

  return null;
};

const handleSubmit = async () => {
  const validationError = validateForm();
  if (validationError) {
    error.value = validationError;
    window.scrollTo(0,0);
    return;
  }

  isSubmitting.value = true;
  error.value = null;

  try {
    const payload: any = { ...form };

    if (isEditMode.value) {
      await updateActivity(activityId, payload);
      alert('Activity updated successfully!');
    } else {
      await createActivity(payload);
      alert('Activity created successfully!');
    }
    router.push({ name: 'activity-list' });
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || "Operation failed.";
    window.scrollTo(0,0);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <BContainer class="py-4">
    <BButton variant="outline-secondary" class="mb-3" :to="{ name: 'activity-list' }">&larr; Back to List</BButton>

    <h1>{{ isEditMode ? 'Update Activity' : 'Create New Activity' }}</h1>
    <p class="text-muted">Logged in as: <strong>{{ currentRole }}</strong></p>

    <div v-if="isLoading" class="text-center py-5"><BSpinner /></div>

    <BAlert v-if="error" variant="danger" show>{{ error }}</BAlert>

    <BCard v-if="!isLoading" class="shadow-sm">
      <BForm @submit.prevent="handleSubmit">
        <BRow>
          <BCol md="6" class="mb-3">
            <BFormGroup label="Activity Name *">
              <BFormInput v-model="form.activityName" required />
            </BFormGroup>
          </BCol>
          <BCol md="6" class="mb-3">
            <BFormGroup label="Activity Type *">
              <BFormSelect
                v-model="form.activityType"
                :options="allowedTypes"
                required
                :disabled="isEditMode"
                :class="{'bg-light': isEditMode}"
              />
              <small v-if="isEditMode" class="text-muted">Type cannot be changed after creation.</small>
            </BFormGroup>
          </BCol>

          <BCol md="6" class="mb-3">
            <BFormGroup label="Activity Item *" description="e.g. Garuda GA-404, Toyota Avanza B 1234 CD">
              <BFormInput v-model="form.activityItem" required />
            </BFormGroup>
          </BCol>
          <BCol md="3" class="mb-3">
             <BFormGroup label="Price (Rp) *">
              <BFormInput v-model.number="form.price" type="number" min="1" required />
            </BFormGroup>
          </BCol>
          <BCol md="3" class="mb-3">
             <BFormGroup label="Capacity *">
              <BFormInput v-model.number="form.capacity" type="number" min="1" required />
            </BFormGroup>
          </BCol>

          <BCol md="6" class="mb-3">
            <BFormGroup label="Start Location *">
              <BFormSelect v-model="form.startLocation" :options="LOCATION_OPTIONS" required />
            </BFormGroup>
          </BCol>
          <BCol md="6" class="mb-3">
            <BFormGroup label="End Location *">
              <BFormSelect v-model="form.endLocation" :options="LOCATION_OPTIONS" required />
            </BFormGroup>
          </BCol>

          <BCol md="6" class="mb-3">
            <BFormGroup label="Start Date *">
              <BFormInput v-model="form.startDate" type="datetime-local" required />
            </BFormGroup>
          </BCol>
          <BCol md="6" class="mb-3">
            <BFormGroup label="End Date *">
              <BFormInput v-model="form.endDate" type="datetime-local" required />
            </BFormGroup>
          </BCol>
        </BRow>

        <div class="d-flex justify-content-end mt-4">
          <BButton variant="secondary" class="me-2" :to="{ name: 'activity-list' }">Cancel</BButton>
          <BButton type="submit" variant="primary" :disabled="isSubmitting">
            <BSpinner small v-if="isSubmitting" />
            {{ isEditMode ? 'Update Changes' : 'Create Activity' }}
          </BButton>
        </div>
      </BForm>
    </BCard>
  </BContainer>
</template>
