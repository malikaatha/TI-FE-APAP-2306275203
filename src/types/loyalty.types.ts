export interface Coupon {
  id: string;
  name: string;
  description: string;
  points: number;
  percentOff: number;
  createdDate: string;
  updatedDate: string;
}

export interface PurchasedCoupon {
  id: string;
  code: string;
  customerId: string;
  coupon: Coupon;
  purchasedDate: string;
  usedDate: string | null;
}

export interface LoyaltyPoints {
  customerId: string;
  points: number;
}

export interface CreateCouponRequest {
  name: string;
  description: string;
  points: number;
  percentOff: number;
}

export interface PurchaseCouponRequest {
  customerId: string;
  couponId: string;
}
