import axios from 'axios';
import type { Package, CreatePackageDto, UpdatePackageDto } from '@/types/package.types';

const API_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createPackage = async (packageData: CreatePackageDto): Promise<Package> => {
  try {
    const response = await apiClient.post('/package/create', packageData);
    return response.data;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const getAllPackages = async (): Promise<Package[]> => {
  try {
    const response = await apiClient.get('/package');
    return response.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

export const getPackageById = async (id: string): Promise<Package> => {
  try {
    const response = await apiClient.get(`/package/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching package with id ${id}:`, error);
    throw error;
  }
};

export const updatePackage = async (id: string, packageData: UpdatePackageDto): Promise<Package> => {
  try {
    const response = await apiClient.put(`/package/${id}/edit`, packageData);
    return response.data;
  } catch (error) {
    console.error(`Error updating package with id ${id}:`, error);
    throw error;
  }
};

export const deletePackage = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/package/${id}/delete`);
  } catch (error) {
    console.error(`Error deleting package with id ${id}:`, error);
    throw error;
  }
};

export const processPackage = async (id: string): Promise<Package> => {
  try {
    const response = await apiClient.put(`/package/${id}/process`);
    return response.data;
  } catch (error) {
    console.error(`Error processing package with id ${id}:`, error);
    throw error;
  }
};
