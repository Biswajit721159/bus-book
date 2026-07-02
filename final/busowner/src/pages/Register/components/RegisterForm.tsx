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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-in" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
        <InputField
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <InputField
          id="companyName"
          type="text"
          label="Company Name"
          placeholder="Acme Transport Co."
          error={errors.companyName?.message}
          {...register('companyName')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
        <InputField
          id="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <InputField
          id="phoneNumber"
          type="tel"
          label="Phone Number"
          placeholder="9876543210"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
        <InputField
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Min. 8 characters"
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
          error={errors.confirmPassword?.message}
          rightElement={
            <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          }
          {...register('confirmPassword')}
        />
      </div>

      <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
        Password must be 8–20 characters and include uppercase, lowercase, a digit, and a special character
        (@$!%*?&#).
      </p>

      <SubmitButton isLoading={isLoading} label="Create Account" loadingLabel="Creating account..." />
    </form>
  );
};

export default RegisterForm;
