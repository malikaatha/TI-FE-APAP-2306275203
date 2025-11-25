import axios from 'axios';
import type { Activity, CreateActivityRequest } from '@/interfaces/activity.interface';

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

export const getAllActivities = async (): Promise<Activity[]> => {
  const response = await apiClient.get('/activity'); // Sesuaikan endpoint BE
  return response.data;
};

export const getActivityById = async (id: string): Promise<Activity> => {
  const response = await apiClient.get(`/activity/${id}`);
  return response.data;
};

export const createActivity = async (data: CreateActivityRequest): Promise<Activity> => {
  const response = await apiClient.post('/activity/create', data);
  return response.data;
};

export const updateActivity = async (id: string, data: CreateActivityRequest): Promise<Activity> => {
  const response = await apiClient.put(`/activity/${id}/update`, data);
  return response.data;
};

export const deleteActivity = async (id: string): Promise<void> => {
  await apiClient.delete(`/activity/${id}/delete`);
};

export const LOCATION_OPTIONS = [
  'DKI Jakarta (Provinsi)',
  'Bali (Provinsi)',
  'Jawa Barat (Provinsi)',
  'Yogyakarta (Provinsi)'
];

export const ACTIVITY_TYPES = ['Flight', 'Accommodation', 'Vehicle Rental'];
