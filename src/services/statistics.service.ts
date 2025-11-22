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
