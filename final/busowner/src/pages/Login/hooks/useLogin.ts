import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { authApi } from '../../../services/api/auth';
import { Add_User } from '../../../store/slices/authSlice';
import type { LoginFormData } from '../../../lib/validationSchemas';

export type LoginStep = 1 | 2;

interface UseLoginReturn {
  step: LoginStep;
  isLoading: boolean;
  resendCountdown: number;
  emailForOtp: string;
  onLoginSubmit: (data: LoginFormData) => Promise<void>;
  onVerifyOtp: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  onGoogleLogin: (credential: string) => Promise<void>;
  goBack: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [step, setStep] = useState<LoginStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loginData, setLoginData] = useState<LoginFormData | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const startResendTimer = () => {
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const res = await authApi.login(data);
      toast.success(res.message || 'OTP sent to your email');
      setLoginData(data);
      setStep(2);
      startResendTimer();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (otp: string) => {
    if (!loginData) return;
    try {
      setIsLoading(true);
      const res = await authApi.loginVerifyOtp({ email: loginData.email, otp, password: loginData.password });
      toast.success(res.message || 'Logged in successfully');
      dispatch(Add_User(res.data));
      navigate('/Dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (!loginData || resendCountdown > 0) return;
    try {
      setIsLoading(true);
      await authApi.login(loginData);
      toast.success('OTP resent to your email');
      startResendTimer();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async (credential: string) => {
    try {
      setIsLoading(true);
      const res = await authApi.googleLogin(credential);
      toast.success(res.message || 'Signed in with Google');
      dispatch(Add_User(res.data));
      navigate('/Dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => setStep(1);

  return {
    step,
    isLoading,
    resendCountdown,
    emailForOtp: loginData?.email ?? '',
    onLoginSubmit,
    onVerifyOtp,
    onResendOtp,
    onGoogleLogin,
    goBack,
  };
};
