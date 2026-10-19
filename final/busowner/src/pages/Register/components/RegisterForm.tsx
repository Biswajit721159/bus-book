import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../../../lib/validationSchemas';
import InputField from '../../../components/forms/InputField';
import PasswordToggle from '../../../components/forms/PasswordToggle';
import SubmitButton from '../../../components/forms/SubmitButton';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="fullName"
          type="text"
          label="Operator Full Name"
          placeholder="e.g. Rajesh Sharma"
          autoComplete="name"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <InputField
          id="companyName"
          type="text"
          label="Fleet / Travels Name"
          placeholder="e.g. Royal Cruiser Fleet"
          autoComplete="organization"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          error={errors.companyName?.message}
          {...register('companyName')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="email"
          type="email"
          label="Official Email Address"
          placeholder="rajesh@royalcruiser.com"
          autoComplete="email"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
            </svg>
          }
          error={errors.email?.message}
          {...register('email')}
        />

        <InputField
          id="phoneNumber"
          type="tel"
          label="Commercial Phone Number"
          placeholder="9876543210"
          autoComplete="tel"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Account Password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          error={errors.password?.message}
          rightElement={
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          }
          {...register('password')}
        />

        <InputField
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Repeat password"
          autoComplete="new-password"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          error={errors.confirmPassword?.message}
          rightElement={
            <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          }
          {...register('confirmPassword')}
        />
      </div>

      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600 space-y-1">
        <span className="font-bold text-blue-900 block">Security Requirement:</span>
        <p>Password must be 8–20 characters with uppercase, lowercase, a digit, and a special character.</p>
      </div>

      <SubmitButton isLoading={isLoading} label="Create Fleet Partner Account" loadingLabel="Registering fleet account..." />
    </form>
  );
};

export default RegisterForm;
