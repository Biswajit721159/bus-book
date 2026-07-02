import { Bus } from './bus';

export interface Booking {
  _id: string;
  useremail: string;
  bus_id: string;
  bus?: {
    bus_name: string;
  };
  src: string;
  dist: string;
  date: string;
  total_money: number;
  total_distance: number;
  seat_record: string[];
  person: string[];
  status: boolean[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingQuery {
  currentPage: number;
  Email: string;
  Src: string;
  Dist: string;
  BookingDate: string;
  BusName: string;
}

export interface GetBookingsResponse {
  statusCode: number;
  message: string;
  data: {
    totalPage: number;
    bookingData: Booking[];
  };
}
