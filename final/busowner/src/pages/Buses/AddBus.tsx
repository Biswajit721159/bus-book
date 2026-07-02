import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddBus } from './hooks/useAddBus';
import BusDetailsForm from './components/BusDetailsForm';
import StationForm from './components/StationForm';
import FullPageLoader from '../../components/common/FullPageLoader';

export const AddBus: React.FC = () => {
  const navigate = useNavigate();
  const {
    step,
    isLoading,
    busName,
    totalSeats,
    stationList,
    showSubmit,
    proceedToStations,
    addStationToList,
    deleteStation,
    submitBus,
    resetRoute,
    setStep,
  } = useAddBus();

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => navigate(-1)} className="btn-icon text-slate-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">Add New Bus</h1>
          <p className="text-sm text-slate-500">Fill in bus details and define the route stations</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8">
        {['Bus Details', 'Route Stations'].map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step > i + 1
                    ? 'bg-emerald-500 text-white'
                    : step === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > i + 1 ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
            {i < 1 && <div className="flex-1 h-px bg-slate-200" />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <BusDetailsForm
          onSubmit={proceedToStations}
          defaultValues={{ busName, totalSeat: totalSeats || '' }}
        />
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-4 flex items-center gap-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-850">{busName}</p>
              <p className="text-sm text-slate-500">
                {totalSeats} seats · {stationList.length} station{stationList.length !== 1 ? 's' : ''} added
              </p>
            </div>
            <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs font-semibold text-indigo-600 hover:underline">
              Edit Details
            </button>
          </div>

          {stationList.length > 0 && (
            <div className="card overflow-hidden rounded-2xl border border-slate-100 shadow-md bg-white">
              <div className="card-header flex items-center justify-between p-4 border-b border-slate-50">
                <h3 className="section-title text-base font-semibold">Route Stations</h3>
                <span className="text-xs text-slate-400 font-medium">
                  {stationList.length} station{stationList.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-550">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-550">Station</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-550">Arrival Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-550">Distance (km)</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stationList.map((item, idx) => (
                      <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-805">{item.station}</td>
                        <td className="px-4 py-3 text-slate-600 font-medium">{item.arrived_time}</td>
                        <td className="px-4 py-3 text-slate-600 font-medium">{item.Distance_from_Previous_Station} km</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteStation(idx)}
                            className="btn-icon text-red-400 hover:text-red-650 hover:bg-red-50 p-1.5 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!showSubmit ? (
            <StationForm onAdd={addStationToList} isFirst={stationList.length === 0} />
          ) : (
            <div className="card p-6 text-center bg-emerald-50/50 border border-emerald-100 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Route Complete</h3>
              <p className="text-sm text-slate-500 mb-4">
                {stationList.length} stations defined. Submit to register your bus.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button type="button" onClick={resetRoute} className="btn-secondary font-semibold">
                  Add More Stations
                </button>
                <button type="button" onClick={submitBus} disabled={isLoading} className="btn-success font-semibold flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Bus
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <FullPageLoader open={isLoading} />
    </div>
  );
};

export default AddBus;
