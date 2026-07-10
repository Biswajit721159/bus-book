import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { busApi, bookingApi } from '../../../services/apiService';
import { searchData } from '../../../utils/helpers';
import type { Bus } from '../../../types/bus';
import type { Booking } from '../../../types/booking';

const today = new Date().toISOString().split('T')[0];

interface UseAdminBookingsReturn {
  busData: Bus[];
  isLoading: boolean;
  date: string;
  setDate: (date: string) => void;
  selectedBus: string;
  setSelectedBus: (busName: string) => void;
  filteredBookings: Booking[];
  searchId: string;
  setSearchId: (id: string) => void;
  passengerModal: { open: boolean; data: Booking | null };
  openPassengerModal: (booking: Booking) => void;
  closePassengerModal: () => void;
  findBookings: (e: React.FormEvent) => Promise<void>;
  selectOptions: { value: string; label: string }[];
  currentPage: number;
  fetchBookingsForPage: (page: number) => Promise<void>;
}

export const useAdminBookings = (): UseAdminBookingsReturn => {
  const [busData, setBusData] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(today);
  const [selectedBus, setSelectedBus] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchId, setSearchId] = useState('');
  const [passengerModal, setPassengerModal] = useState<{ open: boolean; data: Booking | null }>({
    open: false,
    data: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const loadBuses = async () => {
    try {
      setIsLoading(true);
      const res = await busApi.getAll();
      if (res?.data?.data) {
        setBusData(res.data.data);
      }
    } catch (e: any) {
      toast.warn(e?.message || 'Failed to load buses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  useEffect(() => {
    const filtered = searchId ? searchData(bookings, searchId, '_id') : bookings;
    setFilteredBookings(filtered);
  }, [searchId, bookings]);

  const openPassengerModal = (booking: Booking) => {
    setPassengerModal({ open: true, data: booking });
  };

  const closePassengerModal = () => {
    setPassengerModal({ open: false, data: null });
  };

  const fetchBookingsForPage = async (page: number) => {
    if (!selectedBus) {
      toast.warn('Please select a bus.');
      return;
    }
    if (!date) {
      toast.warn('Please select a date.');
      return;
    }
    const busId = busData.find((b) => b.bus_name === selectedBus)?._id;
    if (!busId) {
      toast.warn('Bus not found.');
      return;
    }
    try {
      setIsLoading(true);
      const res = await bookingApi.getByStatus(date, busId, page);
      if (res.data) {
        setBookings(res.data);
        setFilteredBookings(res.data);
        setCurrentPage(page);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (e: any) {
      toast.warn(e?.message || 'Failed to fetch bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  const findBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchBookingsForPage(1);
  };

  const selectOptions = busData.map((b) => ({ value: b.bus_name, label: b.bus_name }));

  return {
    busData,
    isLoading,
    date,
    setDate,
    selectedBus,
    setSelectedBus,
    filteredBookings,
    searchId,
    setSearchId,
    passengerModal,
    openPassengerModal,
    closePassengerModal,
    findBookings,
    selectOptions,
    currentPage,
    fetchBookingsForPage,
  };
};
export default useAdminBookings;
