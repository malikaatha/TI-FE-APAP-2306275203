import apiClient from './api';

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
