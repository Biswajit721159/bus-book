import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../lib/validationSchemas';
import { authApi } from '../../services/api/auth';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/forms/InputField';
import SubmitButton from '../../components/forms/SubmitButton';
import { useState } from 'react';

export const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      const res = await authApi.forgotPassword(data.email);
      toast.success(res.message || 'OTP sent to your email');
      navigate('/ResetPassword', { state: { email: data.email } });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email and we'll send an OTP to reset your password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <InputField
          id="forgot-email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <SubmitButton isLoading={isLoading} label="Send Reset OTP" loadingLabel="Sending..." />
      </form>

      <div className="mt-8 text-center">
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

export default ForgotPassword;
