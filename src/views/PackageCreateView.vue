<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { BContainer, BForm, BFormGroup, BFormInput, BButton, BAlert } from 'bootstrap-vue-next';
import { createPackage } from '@/services/package.service';

const router = useRouter();

const form = reactive({
  packageName: '',
  userId: '',
  quota: 1,
  startDate: '',
  endDate: ''
});

const error = ref<string | null>(null);
const isSubmitting = ref(false);

const validateForm = () => {
  if (!form.packageName.trim()) {
    error.value = 'Package name is required';
    return false;
  }
  if (!form.userId.trim()) {
    error.value = 'User ID is required';
    return false;
  }
  if (form.quota <= 0) {
    error.value = 'Quota must be a positive number';
    return false;
  }
  if (!form.startDate || !form.endDate) {
    error.value = 'Start and End dates are required';
    return false;
  }

  const start = new Date(form.startDate);
  const end = new Date(form.endDate);
  if (end < start) {
    error.value = 'End date cannot be before start date';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  error.value = null;
  if (!validateForm()) {
    return;
  }

  try {
    isSubmitting.value = true;
    await createPackage(form);
    router.push({ name: 'packages-list' });
  } catch (err: any) {
    error.value = err.response?.data || err.message || 'An unexpected error occurred.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <BContainer>
    <h1 class="mb-4">Create New Package</h1>

    <BAlert v-if="error" variant="danger" show dismissible @dismissed="error = null">
      {{ error }}
    </BAlert>

    <BForm @submit.prevent="handleSubmit">
      <BFormGroup
        label="Package Name"
        label-for="packageName"
        class="mb-3"
      >
        <BFormInput
          id="packageName"
          v-model="form.packageName"
          required
          placeholder="e.g., Bali Adventure Trip"
        />
      </BFormGroup>

      <BFormGroup
        label="User ID"
        label-for="userId"
        class="mb-3"
      >
        <BFormInput
          id="userId"
          v-model="form.userId"
          required
          placeholder="e.g., user001"
        />
      </BFormGroup>

      <BFormGroup
        label="Quota"
        label-for="quota"
        class="mb-3"
      >
        <BFormInput
          id="quota"
          v-model="form.quota"
          type="number"
          min="1"
          required
        />
      </BFormGroup>

      <BFormGroup
        label="Start Date and Time"
        label-for="startDate"
        class="mb-3"
      >
        <BFormInput
          id="startDate"
          v-model="form.startDate"
          type="datetime-local"
          required
        />
      </BFormGroup>

      <BFormGroup
        label="End Date and Time"
        label-for="endDate"
      >
        <BFormInput
          id="endDate"
          v-model="form.endDate"
          type="datetime-local"
          required
          :min="form.startDate"
        />
      </BFormGroup>

      <div class="mt-4 d-flex gap-2">
        <BButton
          type="submit"
          variant="primary"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isSubmitting ? ' Creating...' : 'Create Package' }}
        </BButton>
        <BButton
          variant="secondary"
          @click="router.push({ name: 'packages-list' })"
          :disabled="isSubmitting"
        >
          Cancel
        </BButton>
      </div>
    </BForm>
  </BContainer>
</template>
