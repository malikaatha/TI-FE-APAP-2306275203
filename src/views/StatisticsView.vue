<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { getRevenueStats } from '@/services/statistics.service';
import { BContainer, BCard, BRow, BCol, BForm, BFormSelect, BButton, BAlert, BSpinner } from 'bootstrap-vue-next';

import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const filters = reactive({
  year: new Date().getFullYear(),
  month: 0
});

const yearOptions = [2024, 2025, 2026];
const monthOptions = [
  { value: 0, text: 'All' },
  { value: 1, text: 'January' }, { value: 2, text: 'February' },
  { value: 3, text: 'March' }, { value: 4, text: 'April' },
  { value: 5, text: 'May' }, { value: 6, text: 'June' },
  { value: 7, text: 'July' }, { value: 8, text: 'August' },
  { value: 9, text: 'September' }, { value: 10, text: 'October' },
  { value: 11, text: 'November' }, { value: 12, text: 'December' }
];

const fetchStats = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const year = filters.year;
    const month = filters.month === 0 ? undefined : filters.month;

    const stats = await getRevenueStats(year, month);

    if (stats && stats.length > 0) {
      chartData.value = {
        labels: stats.map((item: any) => item.activityType),
        datasets: [{
          label: 'Revenue by Activity Type',
          backgroundColor: '#36A2EB',
          data: stats.map((item: any) => item.totalRevenue)
        }]
      };
    } else {
      chartData.value = null;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch statistics.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchStats);
</script>

<template>
  <BContainer>
    <h1 class="mb-4">Potential Revenue Statistics</h1>

    <BCard class="mb-4">
      <BForm @submit.prevent="fetchStats">
        <BRow class="align-items-end">
          <BCol md="4">
            <label for="year-select">Year:</label>
            <BFormSelect id="year-select" v-model="filters.year" :options="yearOptions" />
          </BCol>
          <BCol md="4">
            <label for="month-select">Month:</label>
            <BFormSelect id="month-select" v-model="filters.month" :options="monthOptions" />
          </BCol>
          <BCol md="4">
            <BButton type="submit" variant="primary" class="w-100">Show Statistic</BButton>
          </BCol>
        </BRow>
      </BForm>
    </BCard>

    <BCard header="Revenue by Activity Type">
      <BAlert v-if="error" variant="danger" show>{{ error }}</BAlert>
      <div v-if="isLoading" class="text-center p-5">
        <BSpinner />
        <p class="mt-2">Loading chart data...</p>
      </div>
      <div v-else-if="chartData">
        <Bar :data="chartData" />
      </div>
      <p v-else class="text-muted text-center p-5">No data available for the selected period.</p>
    </BCard>

  </BContainer>
</template>
