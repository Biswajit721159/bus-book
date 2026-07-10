export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'available' | 'on_trip' | 'leave';
}
