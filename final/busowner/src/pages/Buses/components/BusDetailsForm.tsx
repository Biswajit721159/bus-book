import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { busInfoSchema, type BusInfoFormData } from '../../../lib/validationSchemas';
import InputField from '../../../components/forms/InputField';

interface BusDetailsFormProps {
  onSubmit: (data: BusInfoFormData) => void;
  defaultValues: { busName: string; totalSeat: number | string };
}

export const BusDetailsForm: React.FC<BusDetailsFormProps> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusInfoFormData>({
    resolver: zodResolver(busInfoSchema),
    defaultValues: {
      busName: defaultValues.busName,
      totalSeat: defaultValues.totalSeat ? Number(defaultValues.totalSeat) : undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 bg-white shadow-md rounded-2xl border border-slate-100 animate-fade-in" noValidate>
      <h2 className="section-title mb-4">Bus Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="busName"
          type="text"
          label="Bus Name"
          placeholder="e.g. Express Deluxe"
          error={errors.busName?.message}
          {...register('busName')}
        />
        <InputField
          id="totalSeat"
          type="number"
          label="Total Seats"
          placeholder="e.g. 40"
          error={errors.totalSeat?.message}
          {...register('totalSeat', { valueAsNumber: true })}
        />
      </div>
      <div className="flex justify-end mt-6">
        <button type="submit" className="btn-primary flex items-center gap-2">
          Next: Add Stations
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default BusDetailsForm;
