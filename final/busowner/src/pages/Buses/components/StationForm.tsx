import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stationSchema, type StationFormData } from '../../../lib/validationSchemas';
import InputField from '../../../components/forms/InputField';

interface StationFormProps {
  onAdd: (station: string, arrivedTime: string, distance: number, isLast: boolean) => void;
  isFirst: boolean;
}

export const StationForm: React.FC<StationFormProps> = ({ onAdd, isFirst }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StationFormData>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      station: '',
      arrived_time: '',
      Distance_from_Previous_Station: 0,
      isLastStation: false,
    },
  });

  const onSubmitForm = (data: StationFormData) => {
    onAdd(
      data.station.toUpperCase(),
      data.arrived_time,
      Number(data.Distance_from_Previous_Station) || 0,
      !!data.isLastStation
    );
    reset({
      station: '',
      arrived_time: '',
      Distance_from_Previous_Station: 0,
      isLastStation: false,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="card p-6 bg-white shadow-md rounded-2xl border border-slate-100 animate-fade-in" noValidate>
      <h3 className="section-title mb-4">
        {isFirst ? 'Add First Station' : 'Add Next Station'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          id="stationName"
          type="text"
          label="Station Name"
          placeholder="e.g. MUMBAI"
          error={errors.station?.message}
          {...register('station')}
        />
        <InputField
          id="arrivedTime"
          type="time"
          label="Arrival Time (24h)"
          error={errors.arrived_time?.message}
          {...register('arrived_time')}
        />
        <InputField
          id="distance"
          type="number"
          label="Distance from Prev. (km)"
          placeholder="0"
          error={errors.Distance_from_Previous_Station?.message}
          {...register('Distance_from_Previous_Station', { valueAsNumber: true })}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            {...register('isLastStation')}
          />
          <span className="text-sm text-slate-600">This is the last station</span>
        </label>
        <button type="submit" className="btn-primary flex items-center gap-2 py-2 px-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Station
        </button>
      </div>
    </form>
  );
};

export default StationForm;
