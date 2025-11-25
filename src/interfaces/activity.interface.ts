export interface Activity {
  id: string;
  activityName: string;
  activityType: 'Flight' | 'Accommodation' | 'Vehicle Rental';
  price: number;
  capacity: number;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
  activityItem: string;
  isDeleted: boolean;
  vendorId?: string;
}

export interface CreateActivityRequest {
  activityName: string;
  activityType: string;
  price: number;
  capacity: number;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
  activityItem: string;
}

export interface ActivityFilter {
  showDeleted: boolean;
  activityType: string | null;
  startLocation: string | null;
  endLocation: string | null;
  startDate: string | null;
  endDate: string | null;
  searchQuery: string;
}
