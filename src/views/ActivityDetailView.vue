<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getActivityById } from '@/services/activity.service';
import type { Activity } from '@/interfaces/activity.interface';
import { BContainer, BCard, BRow, BCol, BButton, BBadge, BSpinner, BAlert } from 'bootstrap-vue-next';

const route = useRoute();
const activityId = route.params.id as string;
const activity = ref<Activity | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    activity.value = await getActivityById(activityId);
  } catch (err) {
    error.value = "Activity not found.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <BContainer class="py-4">
    <BButton variant="outline-secondary" class="mb-3" :to="{ name: 'activity-list' }">&larr; Back to List</BButton>

    <div v-if="isLoading" class="text-center"><BSpinner /></div>
    <BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>

    <div v-else-if="activity">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1>{{ activity.activityName }}</h1>
        <BBadge :variant="activity.isDeleted ? 'danger' : 'success'">
          {{ activity.isDeleted ? 'Deleted' : 'Active' }}
        </BBadge>
      </div>

      <BCard class="shadow-sm">
        <BRow class="g-4">
          <BCol md="6">
            <strong>Activity Type:</strong>
            <p>{{ activity.activityType }}</p>
          </BCol>
          <BCol md="6">
            <strong>Activity Item:</strong>
            <p>{{ activity.activityItem }}</p>
          </BCol>
          <BCol md="6">
            <strong>Price:</strong>
            <p class="h5 text-primary">Rp {{ activity.price.toLocaleString() }}</p>
          </BCol>
          <BCol md="6">
            <strong>Capacity:</strong>
            <p>{{ activity.capacity }} pax</p>
          </BCol>
          <hr>
          <BCol md="6">
            <strong>Start:</strong>
            <p>{{ new Date(activity.startDate).toLocaleString() }} <br> <small class="text-muted">{{ activity.startLocation }}</small></p>
          </BCol>
          <BCol md="6">
            <strong>End:</strong>
            <p>{{ new Date(activity.endDate).toLocaleString() }} <br> <small class="text-muted">{{ activity.endLocation }}</small></p>
          </BCol>
        </BRow>

        <div class="mt-4 border-top pt-3 d-flex justify-content-end gap-2">
            <BButton variant="warning" :to="{ name: 'activity-edit', params: { id: activity.id } }" :disabled="activity.isDeleted">
                Edit Activity
            </BButton>
        </div>
      </BCard>
    </div>
  </BContainer>
</template>
