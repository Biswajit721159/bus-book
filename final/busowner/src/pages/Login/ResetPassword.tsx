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
      toast.warn('Please enter your new password first');
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
      title="Create New Password"
      subtitle={
        <span>
          Enter your new password and the verification code sent to{' '}
          <strong className="text-slate-900 font-semibold">{email}</strong>
        </span>
      }
    >
      <form className="space-y-4 mb-6 animate-fade-in" noValidate>
        <InputField
          id="new-password"
          type={showPassword ? 'text' : 'password'}
          label="New Password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          error={errors.password?.message}
          rightElement={
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
          }
          {...register('password')}
        />

        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600">
          <span className="font-bold text-blue-900 block">Security Requirement:</span>
          <p>Password must be 8–20 characters with uppercase, lowercase, digit, and special character.</p>
        </div>
      </form>

      <div>
        <OtpForm
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          resendDisabled={resendCountdown > 0}
          resendCountdown={resendCountdown}
          loading={isLoading}
        />
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <Link
          to="/Login"
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5"
        >
          <span>← Back to Operator Sign In</span>
        </Link>
      </div>
    </AuthCard>
  );
};

export default ResetPassword;
