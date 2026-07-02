import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../lib/validationSchemas';
import { authApi } from '../../services/api/auth';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/forms/InputField';
import PasswordToggle from '../../components/forms/PasswordToggle';
import OtpForm from '../../components/auth/OtpForm';

export const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();
  const email: string | undefined = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.warn('Please initiate password reset first');
      navigate('/ForgotPassword');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleVerifyOtp = async (otp: string) => {
    const { password } = getValues();
    if (!password) {
      toast.warn('Enter your new password first');
      return;
    }
    try {
      setIsLoading(true);
      const res = await authApi.resetPassword({ email: email!, otp, password });
      toast.success(res.message || 'Password reset successfully');
      navigate('/Login');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || !email) return;
    try {
      setIsLoading(true);
      await authApi.forgotPassword(email);
      toast.success('OTP resent successfully');
      setResendCountdown(30);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle={
        <>
          Enter your new password and the OTP sent to{' '}
          <span className="font-semibold text-slate-800">{email}</span>
        </>
      }
    >
      <form className="space-y-5" noValidate>
        <InputField
          id="new-password"
          type={showPassword ? 'text' : 'password'}
          label="New Password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          rightElement={
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
          }
          {...register('password')}
        />

        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          Password must be 8–20 characters with uppercase, lowercase, digit, and special character
          (@$!%*?&#).
        </p>
      </form>

      <div className="mt-5">
        <OtpForm
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          resendDisabled={resendCountdown > 0}
          resendCountdown={resendCountdown}
          loading={isLoading}
        />
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/Login"
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </AuthCard>
  );
};

export default ResetPassword;
