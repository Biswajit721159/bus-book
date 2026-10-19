import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState, invalidateBusCache } from '../../../store';
import { busApi } from '../../../services/apiService';
import { ROLES } from '../../../utils/constants';
import type { Bus, StationData } from '../../../types/bus';

interface UseEditBusReturn {
  data: Partial<Bus>;
  isLoading: boolean;
  isSuperAdmin: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStationChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  addStation: () => void;
  removeStation: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  updateStatus: (status: Bus['status']) => void;
}

export const useEditBus = (): UseEditBusReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id: urlId } = useParams<{ _id: string }>();
  const [data, setData] = useState<Partial<Bus>>(location.state?.data || {});
  const [isLoading, setIsLoading] = useState(false);

  const otherUserinfo = useSelector((state: RootState) => state.userAuth.otherUserinfo);
  const isSuperAdmin = otherUserinfo?.role === ROLES.SUPER_ADMIN;

  useEffect(() => {
    if ((!data._id || !data.bus_name) && urlId) {
      const fetchBus = async () => {
        try {
          setIsLoading(true);
          const res = await busApi.getById(urlId);
          if (res?.data) {
            setData(res.data);
          } else {
            toast.warn('Bus not found');
            navigate('/Dashboard');
          }
        } catch (e: any) {
          toast.warn(e.message || 'Failed to load bus details');
          navigate('/Dashboard');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBus();
    }
  }, [urlId, data._id, data.bus_name, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!data.station_data) return;

    const updated = data.station_data.map((s, i) =>
      i === index
        ? {
            ...s,
            [name]:
              name === 'Distance_from_Previous_Station'
                ? (value === '' ? 0 : Number(value))
                : name === 'arrived_time'
                ? value
                : value.toUpperCase(),
          }
        : s
    );
    setData((prev) => ({ ...prev, station_data: updated }));
  };

  const addStation = () => {
    const newStation: StationData = { station: '', arrived_time: '', Distance_from_Previous_Station: 0 };
    setData((prev) => ({
      ...prev,
      station_data: [...(prev.station_data || []), newStation],
    }));
  };

  const removeStation = (index: number) => {
    if (!data.station_data) return;
    setData((prev) => ({
      ...prev,
      station_data: prev.station_data!.filter((_, i) => i !== index),
    }));
  };

  const updateStatus = (status: Bus['status']) => {
    setData((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveId = data._id || urlId;
    if (!effectiveId) {
      toast.warn('Invalid bus ID.');
      return;
    }
    if (!data.bus_name?.trim() || !data.Total_seat) {
      toast.warn('Bus name and seat count are required.');
      return;
    }
    if (!data.station_data || data.station_data.length < 2) {
      toast.warn('Please define at least 2 route stations.');
      return;
    }
    try {
      setIsLoading(true);
      const res = await busApi.update({ ...data, _id: effectiveId });
      if (res.statusCode === 200) {
        toast.success(res.message || 'Bus updated successfully');
        invalidateBusCache();
        navigate(-1);
      } else {
        toast.warn(res.message || 'Failed to update bus');
      }
    } catch (err: any) {
      toast.warn(err.message || 'An error occurred during save.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    isSuperAdmin,
    handleInputChange,
    handleStationChange,
    addStation,
    removeStation,
    handleSubmit,
    updateStatus,
  };
};

export default useEditBus;
