import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverSchema, type DriverFormData } from '../../../lib/validationSchemas';
import InputField from '../../../components/forms/InputField';
import SelectField from '../../../components/forms/SelectField';
import type { Driver } from '../../../types/driver';

interface DriverModalProps {
  onClose: () => void;
  onSave: (data: Driver) => Promise<void>;
  driver: Partial<Driver>;
}

export const DriverModal: React.FC<DriverModalProps> = ({ onClose, onSave, driver }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: driver.name || '',
      licenseNumber: driver.licenseNumber || '',
      phone: driver.phone || '',
      status: driver.status || 'available',
    },
  });

  const onSubmit = async (data: DriverFormData) => {
    const driverToSave: Driver = {
      id: driver.id || `drv-${Date.now()}`,
      ...data,
    };
    await onSave(driverToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 animate-fade-in"
        noValidate
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-55">
          <h3 className="font-bold text-slate-800">{driver.id ? 'Edit Driver' : 'Add New Driver'}</h3>
          <button type="button" onClick={onClose} className="btn-icon text-slate-400 p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <InputField
            id="drv-name"
            label="Driver Name"
            placeholder="e.g. Rajesh Kumar"
            error={errors.name?.message}
            {...register('name')}
          />
          <InputField
            id="drv-license"
            label="License Number"
            placeholder="e.g. DL142020..."
            error={errors.licenseNumber?.message}
            {...register('licenseNumber')}
          />
          <InputField
            id="drv-phone"
            label="Phone Number"
            placeholder="e.g. 9876543210"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <SelectField
            label="Status"
            options={[
              { value: 'available', label: 'Available' },
              { value: 'on_trip', label: 'On Trip' },
              { value: 'leave', label: 'On Leave' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 font-semibold">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1 font-semibold flex items-center justify-center gap-1.5" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverModal;
