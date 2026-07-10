import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../../store';
import { setUserInfo } from '../../../store/slices/authSlice';
import { userApi } from '../../../services/apiService';
import type { SettingsFormData } from '../../../lib/validationSchemas';

interface UseSettingsReturn {
  isLoading: boolean;
  email: string;
  companyName: string;
  phoneNumber: string;
  initialFullName: string;
  onSaveProfile: (data: SettingsFormData) => Promise<void>;
}

export const useSettings = (): UseSettingsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  const onSaveProfile = async (data: SettingsFormData) => {
    if (!user?.user?.email) return;
    try {
      setIsLoading(true);
      const res = await userApi.updateProfile(data.fullName, user.user.email);
      if (res.statusCode === 200) {
        toast.success('Profile updated successfully');
        dispatch(setUserInfo({ fullName: data.fullName }));
      } else {
        toast.warn(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      toast.warn(err.message || 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    email: user?.user?.email || '',
    companyName: user?.user?.companyName || '',
    phoneNumber: user?.user?.phoneNumber || '',
    initialFullName: user?.user?.fullName || '',
    onSaveProfile,
  };
};
