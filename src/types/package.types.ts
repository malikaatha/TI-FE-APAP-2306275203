export interface Package {
  id: string;
  packageName: string;
  userId: string;
  quota: number;
  price: number;
  status: 'PENDING' | 'PROCESSED';
  startDate: string;
  endDate: string;
}

export interface CreatePackageDto {
  packageName: string;
  userId: string;
  quota: number;
  startDate: string;
  endDate: string;
}

export interface UpdatePackageDto {
  packageName: string;
  quota: number;
  startDate: string;
  endDate: string;
}

export interface Plan {
  id: string;
  planName: string;
  activityType: 'ACCOMMODATION' | 'VEHICLE_RENTAL' | 'FLIGHT';
  price: number;
  status: 'UNFULFILLED' | 'FULFILLED';
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
  packageId: string;
}

export interface CreatePlanDto {
  planName: string;
  activityType: 'ACCOMMODATION' | 'VEHICLE_RENTAL' | 'FLIGHT';
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
}

export interface UpdatePlanDto {
  planName: string;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
}
