import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../lib/validationSchemas';
import { authApi } from '../../services/api/auth';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/forms/InputField';
import SubmitButton from '../../components/forms/SubmitButton';

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
      title="Reset Account Password"
      subtitle="Enter your registered operator email address to receive a secure recovery code."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in" noValidate>
        <InputField
          id="forgot-email"
          type="email"
          label="Registered Email Address"
          placeholder="operator@company.com"
          autoComplete="email"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
            </svg>
          }
          error={errors.email?.message}
          {...register('email')}
        />

        <SubmitButton isLoading={isLoading} label="Send Recovery OTP" loadingLabel="Sending code..." />
      </form>

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

export default ForgotPassword;
