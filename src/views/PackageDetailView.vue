<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPackageById, updatePackage, deletePackage, processPackage } from '@/services/package.service';
import {
  BContainer, BCard, BRow, BCol,
  BButton, BAlert, BSpinner,
  BForm, BFormGroup, BFormInput, BModal
} from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();

const packageData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const isEditMode = ref(false);
const editFormData = reactive({
  packageName: '',
  quota: 0,
  startDate: '',
  endDate: ''
});

const showDeleteModal = ref(false);
const showProcessModal = ref(false);

const packageId = route.params.id as string;

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
  } catch (err) {
    alert('Update failed! Check console for details.');
    console.error(err);
  }
};

const handleDelete = async () => {
  try {
    await deletePackage(packageId);
    showDeleteModal.value = false;
    alert('Package deleted successfully!');
    router.push('/packages');
  } catch (err) {
    alert('Delete failed! The package might have plans or is already processed.');
    console.error(err);
  }
};

const handleProcess = async () => {
  try {
    await processPackage(packageId);
    showProcessModal.value = false;
    fetchPackage();
    alert('Package processed successfully!');
  } catch (err) {
    alert('Process failed! Make sure all plans are fulfilled.');
    console.error(err);
  }
};

onMounted(fetchPackage);
</script>

<template>
  <BContainer>
    <div v-if="isLoading" class="text-center mt-5"><BSpinner /></div>

    <BAlert v-else-if="error" variant="danger" show>{{ error }}</BAlert>

    <div v-else-if="packageData">
      <BButton variant="outline-secondary" to="/packages" class="mb-3">
        &larr; Back to Packages
      </BButton>

      <BCard v-if="!isEditMode" :header="`Package Details: ${packageData.packageName}`">
        <BRow>
          <BCol md="6">
            <p><strong>User ID:</strong> {{ packageData.userId }}</p>
            <p><strong>Quota:</strong> {{ packageData.quota }}</p>
            <p><strong>Status:</strong> {{ packageData.status }}</p>
          </BCol>
          <BCol md="6">
            <p><strong>Start Date:</strong> {{ new Date(packageData.startDate).toLocaleString() }}</p>
            <p><strong>End Date:</strong> {{ new Date(packageData.endDate).toLocaleString() }}</p>
            <p><strong>Total Price:</strong> Rp {{ new Intl.NumberFormat('id-ID').format(packageData.price) }}</p>
          </BCol>
        </BRow>
        <template #footer>
          <BButton variant="warning" @click="enterEditMode">Edit</BButton>
          <BButton variant="danger" class="ms-2" @click="showDeleteModal = true">Delete</BButton>
          <BButton variant="success" class="ms-2" @click="showProcessModal = true">Process</BButton>
        </template>
      </BCard>

      <BCard v-else header="Edit Package">
        <BForm @submit.prevent="handleUpdate">
          <BFormGroup label="Package Name:" label-for="packageName">
            <BFormInput id="packageName" v-model="editFormData.packageName" required />
          </BFormGroup>
          <BFormGroup label="Quota:" label-for="quota" class="mt-3">
            <BFormInput id="quota" v-model="editFormData.quota" type="number" required />
          </BFormGroup>
          <BFormGroup label="Start Date:" label-for="startDate" class="mt-3">
            <BFormInput id="startDate" v-model="editFormData.startDate" type="datetime-local" required />
          </BFormGroup>
          <BFormGroup label="End Date:" label-for="endDate" class="mt-3">
            <BFormInput id="endDate" v-model="editFormData.endDate" type="datetime-local" required />
          </BFormGroup>
          <div class="mt-4">
            <BButton type="submit" variant="primary">Save Changes</BButton>
            <BButton variant="secondary" class="ms-2" @click="isEditMode = false">Cancel</BButton>
          </div>
        </BForm>
      </BCard>
    </div>

    <BModal v-model="showDeleteModal" title="Confirm Deletion" @ok="handleDelete">
      Are you sure you want to delete this package? This action cannot be undone.
    </BModal>

    <BModal v-model="showProcessModal" title="Confirm Process" @ok="handleProcess">
      Are you sure you want to process this package? This will book all activities.
    </BModal>
  </BContainer>
</template>
