import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { 'Content-Type': 'application/json' }
});

export const getFilteredActivities = async (planId: string) => {
    try {
        const response = await apiClient.get(`/activities?planId=${planId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching filtered activities for plan ${planId}:`, error);
        throw error;
    }
};

export const getAllActivities = async () => {
  try {
    const response = await apiClient.get('/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching all activities:', error);
    throw error;
  }
};

