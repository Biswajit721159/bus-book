import { useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { busApi, bookingApi } from '../../../services/apiService';
import type { Bus } from '../../../types/bus';
import type { Booking } from '../../../types/booking';

// Safe local date formatting (YYYY-MM-DD in local time zone)
export const getLocalToday = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getLocalTomorrow = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const STORAGE_DATE_KEY = 'busowner_admin_bookings_date';
const STORAGE_BUS_KEY = 'busowner_admin_bookings_bus';

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
  findBookings: (e?: React.FormEvent) => Promise<void>;
  selectOptions: { value: string; label: string }[];
  currentPage: number;
  fetchBookingsForPage: (page: number) => Promise<void>;
  getSegmentDistance: (src: string, dist: string) => number;
}

export const useAdminBookings = (): UseAdminBookingsReturn => {
  const [busData, setBusData] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDateState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_DATE_KEY) || getLocalToday();
  });
  const [selectedBus, setSelectedBusState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_BUS_KEY) || '';
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchId, setSearchId] = useState('');
  const [passengerModal, setPassengerModal] = useState<{ open: boolean; data: Booking | null }>({
    open: false,
    data: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const setDate = (newDate: string) => {
    setDateState(newDate);
    if (newDate) {
      localStorage.setItem(STORAGE_DATE_KEY, newDate);
    } else {
      localStorage.removeItem(STORAGE_DATE_KEY);
    }
  };

  const setSelectedBus = (busName: string) => {
    setSelectedBusState(busName);
    if (busName) {
      localStorage.setItem(STORAGE_BUS_KEY, busName);
    } else {
      localStorage.removeItem(STORAGE_BUS_KEY);
    }
  };

  // Load Bus Fleet
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

  // Auto-select first bus if none selected or saved
  useEffect(() => {
    if (busData.length > 0) {
      const savedBus = localStorage.getItem(STORAGE_BUS_KEY);
      const busExists = busData.some((b) => b.bus_name === savedBus);
      if (busExists && savedBus) {
        if (selectedBus !== savedBus) {
          setSelectedBusState(savedBus);
        }
      } else if (!selectedBus) {
        setSelectedBus(busData[0].bus_name);
      }
    }
  }, [busData, selectedBus]);

  // Fetch bookings for a specific bus & date
  const fetchBookingsForPage = useCallback(
    async (page: number) => {
      if (!selectedBus) {
        return;
      }
      if (!date) {
        toast.warn('Please select a journey date.');
        return;
      }
      const busId = busData.find((b) => b.bus_name === selectedBus)?._id;
      if (!busId) {
        return;
      }
      try {
        setIsLoading(true);
        const res = await bookingApi.getByStatus(date, busId, page);
        if (res.data && Array.isArray(res.data)) {
          setBookings(res.data);
          setFilteredBookings(res.data);
          setCurrentPage(page);
        } else {
          setBookings([]);
          setFilteredBookings([]);
        }
      } catch (e: any) {
        toast.warn(e?.message || 'Failed to fetch bookings.');
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedBus, date, busData]
  );

  // Auto-fetch bookings when selected bus, date, or busData changes
  useEffect(() => {
    if (selectedBus && date && busData.length > 0) {
      fetchBookingsForPage(1);
    }
  }, [selectedBus, date, busData, fetchBookingsForPage]);

  // Instant Search filter across confirmed bookings
  useEffect(() => {
    if (!searchId.trim()) {
      setFilteredBookings(bookings);
      return;
    }
    const q = searchId.trim().toLowerCase();
    const filtered = bookings.filter((b) => {
      const idMatch = String(b._id || '').toLowerCase().includes(q);
      const pnrMatch = String(b.pnr_number || '').toLowerCase().includes(q);
      const srcMatch = String(b.src || '').toLowerCase().includes(q);
      const distMatch = String(b.dist || '').toLowerCase().includes(q);
      const personMatch = b.person?.some((name) => String(name || '').toLowerCase().includes(q));
      return idMatch || pnrMatch || srcMatch || distMatch || personMatch;
    });
    setFilteredBookings(filtered);
  }, [searchId, bookings]);

  const openPassengerModal = (booking: Booking) => {
    setPassengerModal({ open: true, data: booking });
  };

  const closePassengerModal = () => {
    setPassengerModal({ open: false, data: null });
  };

  const findBookings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await fetchBookingsForPage(1);
  };

  // Calculate actual distance between source and destination stations using bus route data
  const getSegmentDistance = useCallback(
    (src: string, dist: string): number => {
      const currentBus = busData.find((b) => b.bus_name === selectedBus);
      if (!currentBus || !currentBus.station_data || currentBus.station_data.length === 0) {
        return 0;
      }
      const stations = currentBus.station_data;
      const srcIdx = stations.findIndex(
        (s) => s.station?.trim().toUpperCase() === src?.trim().toUpperCase()
      );
      const distIdx = stations.findIndex(
        (s) => s.station?.trim().toUpperCase() === dist?.trim().toUpperCase()
      );

      if (srcIdx !== -1 && distIdx !== -1 && distIdx > srcIdx) {
        let total = 0;
        for (let i = srcIdx + 1; i <= distIdx; i++) {
          total += Number(stations[i].Distance_from_Previous_Station || 0);
        }
        return total;
      }

      // Fallback: total bus route distance
      return stations.reduce((sum, s) => sum + Number(s.Distance_from_Previous_Station || 0), 0);
    },
    [busData, selectedBus]
  );

  const selectOptions = useMemo(
    () => busData.map((b) => ({ value: b.bus_name, label: b.bus_name })),
    [busData]
  );

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
    getSegmentDistance,
  };
};

export default useAdminBookings;
