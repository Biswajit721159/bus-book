import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditBus } from './hooks/useEditBus';
import { convertUtcToIst } from '../../utils/helpers';
import { STATUS_OPTIONS } from '../../utils/constants';
import FullPageLoader from '../../components/common/FullPageLoader';
import InputField from '../../components/forms/InputField';

export const EditBus: React.FC = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isSuperAdmin,
    handleInputChange,
    handleStationChange,
    addStation,
    removeStation,
    handleSubmit,
    updateStatus,
  } = useEditBus();

  return (
    <div className="page-container max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => navigate(-1)} className="btn-icon text-slate-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">Edit Bus</h1>
          <p className="text-sm text-slate-500">Update bus details and route information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-6 bg-white shadow-md rounded-2xl border border-slate-100">
          <h2 className="section-title mb-4">Bus Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="Bus ID" value={data._id || ''} disabled className="bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" />
            <InputField label="Created At" value={convertUtcToIst(data.createdAt || '')} disabled className="bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" />
            <InputField label="Updated At" value={convertUtcToIst(data.updatedAt || '')} disabled className="bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" />
            <InputField label="Owner Email" value={data.email || ''} disabled className="bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" />
            <InputField
              label="Bus Name"
              name="bus_name"
              value={data.bus_name || ''}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Total Seats"
              type="number"
              name="Total_seat"
              value={data.Total_seat || ''}
              onChange={handleInputChange}
              required
              min="1"
            />
            {isSuperAdmin && (
              <div className="sm:col-span-2">
                <label className="input-label text-slate-700 font-semibold mb-1">Status</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {STATUS_OPTIONS.map(({ value, label, activeCls, dotActive, dotInactive }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateStatus(value as any)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        data.status === value
                          ? activeCls + ' border-transparent'
                          : 'border-slate-200 text-slate-600 bg-white hover:border-slate-350 shadow-sm'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${data.status === value ? dotActive : dotInactive}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card overflow-hidden bg-white shadow-md rounded-2xl border border-slate-100">
          <div className="card-header flex items-center justify-between p-4 border-b border-slate-50">
            <h2 className="section-title text-base font-semibold">Route Stations</h2>
            <button
              type="button"
              onClick={addStation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Station
            </button>
          </div>

          <div className="p-4 space-y-3">
            {data.station_data?.map((station, index) => (
              <div key={index} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-indigo-700">{index + 1}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Station {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStation(index)}
                    className="btn-icon text-red-400 hover:text-red-650 hover:bg-red-50 p-1.5 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField
                    label="Station Name"
                    name="station"
                    value={station.station || ''}
                    onChange={(e) => handleStationChange(index, e)}
                    required
                  />
                  <InputField
                    label="Arrival Time"
                    type="time"
                    name="arrived_time"
                    value={station.arrived_time || ''}
                    onChange={(e) => handleStationChange(index, e)}
                    required
                  />
                  <InputField
                    label="Distance from Prev. (km)"
                    type="number"
                    name="Distance_from_Previous_Station"
                    value={station.Distance_from_Previous_Station ?? 0}
                    onChange={(e) => handleStationChange(index, e)}
                    required
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary font-semibold">
            Cancel
          </button>
          <button type="submit" className="btn-success font-semibold flex items-center gap-2" disabled={isLoading}>
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

      <FullPageLoader open={isLoading} />
    </div>
  );
};

export default EditBus;
