import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { 'Content-Type': 'application/json' }
});

export const addActivityToPlan = async (planId: string, data: any) => {
    try {
        const response = await apiClient.post(`/ordered-activities/create/plan/${planId}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error adding activity to plan ${planId}:`, error);
        throw error;
    }
};

export const updateOrderedQuantity = async (oqId: string, data: { orderedQuota: number }) => {
  try {
    const response = await apiClient.put(`/ordered-activities/${oqId}/edit`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating ordered quantity ${oqId}:`, error);
    throw error;
  }
};

export const removeActivityFromPlan = async (oqId: string) => {
    try {
        const response = await apiClient.delete(`/ordered-activities/${oqId}/delete`);
        return response.data;
    } catch (error) {
        console.error(`Error removing activity ${oqId}:`, error);
        throw error;
    }
};
