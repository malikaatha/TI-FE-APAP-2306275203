import axios from 'axios';

const API_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

