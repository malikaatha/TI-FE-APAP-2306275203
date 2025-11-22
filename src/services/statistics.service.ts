import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { 'Content-Type': 'application/json' }
});

export const getRevenueStats = async (year?: number, month?: number) => {
  try {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;

    const response = await apiClient.get('/statistics', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
