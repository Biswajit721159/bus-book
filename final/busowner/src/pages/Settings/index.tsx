import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, type SettingsFormData } from '../../lib/validationSchemas';
import { useSettings } from './hooks/useSettings';
import InputField from '../../components/forms/InputField';
import FullPageLoader from '../../components/common/FullPageLoader';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ReadOnlyField: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div>
    <label className="input-label">{label}</label>
    <div className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <span className="text-sm font-medium truncate">{value || '—'}</span>
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userAuth);
  const { isLoading, email, companyName, phoneNumber, initialFullName, onSaveProfile } = useSettings();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    values: { fullName: initialFullName },
  });

  const initials = (user?.user?.fullName || 'U').charAt(0).toUpperCase();

  return (
    <div className="page-container max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Manage your account details and company information</p>
      </div>

      {/* Avatar card */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
        <div>
          <p className="font-bold text-slate-900 text-lg">{user?.user?.fullName}</p>
          <p className="text-sm text-slate-500 mt-0.5">{email}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Active Account
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="section-title">Edit Profile</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4" noValidate>
            <ReadOnlyField
              label="Email Address"
              value={email}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />

            <InputField
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="Your full name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            {companyName && (
              <ReadOnlyField
                label="Company Name"
                value={companyName}
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
              />
            )}

            {phoneNumber && (
              <ReadOnlyField
                label="Phone Number"
                value={phoneNumber}
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
              />
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-6">
              <button
                type="submit"
                className="btn-primary px-7"
                disabled={isLoading || !isDirty}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <FullPageLoader open={isLoading} />
    </div>
  );
};

export default Settings;
