import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../../../services/api/auth';
import type { RegisterFormData } from '../../../lib/validationSchemas';

export type RegisterStep = 1 | 2;

interface UseRegisterReturn {
  step: RegisterStep;
  isLoading: boolean;
  resendCountdown: number;
  emailForOtp: string;
  onRegisterSubmit: (data: RegisterFormData) => Promise<void>;
  onVerifyOtp: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  goBack: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const [step, setStep] = useState<RegisterStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [registerData, setRegisterData] = useState<RegisterFormData | null>(null);

  const navigate = useNavigate();

  const startResendTimer = () => {
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const res = await authApi.register({
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      toast.success(res.message || 'OTP sent to your email');
      setRegisterData(data);
      setStep(2);
      startResendTimer();
    } catch (err: any) {
      toast.warn(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (otp: string) => {
    if (!registerData) return;
    try {
      setIsLoading(true);
      await authApi.registerVerifyOtp({
        email: registerData.email,
        otp,
        password: registerData.password,
      });
      toast.success('Registration verified successfully!');
      navigate('/Login');
    } catch (err: any) {
      toast.warn(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (!registerData || resendCountdown > 0) return;
    try {
      setIsLoading(true);
      const response = await authApi.resendOtp(registerData.email);
      toast.success(response.message || 'OTP resent successfully');
      startResendTimer();
    } catch (err: any) {
      toast.warn(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => setStep(1);

  return {
    step,
    isLoading,
    resendCountdown,
    emailForOtp: registerData?.email ?? '',
    onRegisterSubmit,
    onVerifyOtp,
    onResendOtp,
    goBack,
  };
};
