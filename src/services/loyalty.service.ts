import apiClient from './api';
import type {
  Coupon,
  PurchasedCoupon,
  LoyaltyPoints,
  CreateCouponRequest,
  PurchaseCouponRequest
} from '@/interfaces/loyalty.interface';

// PBI-FE-L1: Get All Available Coupons
export const getAvailableCoupons = async (): Promise<Coupon[]> => {
  const response = await apiClient.get('/loyalty/coupons');
  return response.data;
};

// PBI-FE-L2: Get Purchased Coupons
export const getPurchasedCoupons = async (customerId: string): Promise<PurchasedCoupon[]> => {
  const response = await apiClient.get(`/loyalty/purchased-coupons/${customerId}`);
  return response.data;
};

// Get Points
export const getCustomerPoints = async (customerId: string): Promise<LoyaltyPoints> => {
  const response = await apiClient.get(`/loyalty/points/${customerId}`);
  return response.data;
};

// PBI-FE-L3: Create Coupon
export const createCoupon = async (data: CreateCouponRequest): Promise<Coupon> => {
  const response = await apiClient.post('/loyalty/coupon', data);
  return response.data;
};

// PBI-FE-L4: Update Coupon
export const updateCoupon = async (id: string, data: CreateCouponRequest): Promise<Coupon> => {
  const response = await apiClient.put(`/loyalty/coupon/${id}`, data);
  return response.data;
};

// PBI-FE-L5: Purchase Coupon
export const purchaseCoupon = async (data: PurchaseCouponRequest): Promise<PurchasedCoupon> => {
  const response = await apiClient.post('/loyalty/purchase', data);
  return response.data;
};
