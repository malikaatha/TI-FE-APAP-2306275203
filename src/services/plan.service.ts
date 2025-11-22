import axios from 'axios';

const apiClient = axios.create({
  // Vite akan otomatis ganti ini sesuai environment variable saat build
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { ... }
});

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getPlanById = async (planId: string) => {
  try {
    const response = await apiClient.get(`/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching plan ${planId}:`, error);
    throw error;
  }
};

export const createPlan = async (packageId: string, planData: any) => {
  try {
    const response = await apiClient.post(`/packages/${packageId}/plans/create`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error creating plan for package ${packageId}:`, error);
    throw error;
  }
};

export const deletePlan = async (planId: string) => {
  try {
    const response = await apiClient.delete(`/plans/${planId}/delete`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting plan ${planId}:`, error);
    throw error;
  }
};

export const updatePlan = async (planId: string, planData: any) => {
  try {
    const response = await apiClient.put(`/plans/${planId}/edit`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating plan ${planId}:`, error);
    throw error;
  }
};
