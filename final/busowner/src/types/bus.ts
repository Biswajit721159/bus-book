export interface StationData {
  station: string;
  arrived_time: string;
  Distance_from_Previous_Station: number;
}

export interface Bus {
  _id: string;
  bus_name: string;
  Total_seat: number;
  station_data: StationData[];
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface BusQuery {
  page: number;
  approved: boolean;
  pending: boolean;
  rejected: boolean;
}

export interface GetBusesResponse {
  statusCode: number;
  message: string;
  data: {
    totalPage: number;
    result: Bus[];
  };
}
