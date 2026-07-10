import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { busApi } from '../../../services/apiService';
import type { StationData } from '../../../types/bus';
import type { BusInfoFormData } from '../../../lib/validationSchemas';

interface UseAddBusReturn {
  step: number;
  isLoading: boolean;
  busName: string;
  totalSeats: number;
  stationList: StationData[];
  showSubmit: boolean;
  proceedToStations: (data: BusInfoFormData) => void;
  addStationToList: (station: string, arrivedTime: string, distance: number, isLast: boolean) => void;
  deleteStation: (index: number) => void;
  submitBus: () => Promise<void>;
  resetRoute: () => void;
  setStep: (step: number) => void;
}

export const useAddBus = (): UseAddBusReturn => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [busName, setBusName] = useState('');
  const [totalSeats, setTotalSeats] = useState(0);
  const [stationList, setStationList] = useState<StationData[]>([]);
  const [showSubmit, setShowSubmit] = useState(false);

  const navigate = useNavigate();

  const proceedToStations = (data: BusInfoFormData) => {
    setBusName(data.busName);
    setTotalSeats(data.totalSeat);
    setStep(2);
  };

  const addStationToList = (station: string, arrivedTime: string, distance: number, isLast: boolean) => {
    if (isLast) {
      setShowSubmit(true);
    }
    setStationList((prev) => [
      ...prev,
      {
        station: station.trim().toUpperCase(),
        arrived_time: arrivedTime,
        Distance_from_Previous_Station: distance,
      },
    ]);
  };

  const deleteStation = (index: number) => {
    setStationList((prev) => prev.filter((_, i) => i !== index));
    if (showSubmit) {
      setShowSubmit(false);
    }
  };

  const submitBus = async () => {
    if (stationList.length < 2) {
      toast.warn('Please add at least 2 stations.');
      return;
    }
    try {
      setIsLoading(true);
      const res = await busApi.create(busName, totalSeats, stationList);
      if (res.statusCode === 201) {
        toast.success(res.message || 'Bus registered successfully');
        navigate('/Dashboard');
      } else {
        toast.warn(res.message || 'Failed to register bus');
      }
    } catch (err: any) {
      toast.warn(err.message || 'An error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetRoute = () => {
    setShowSubmit(false);
  };

  return {
    step,
    isLoading,
    busName,
    totalSeats,
    stationList,
    showSubmit,
    proceedToStations,
    addStationToList,
    deleteStation,
    submitBus,
    resetRoute,
    setStep,
  };
};
export default useAddBus;
