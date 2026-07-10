import React from 'react';
import { Booking } from '../../types/booking';

interface PassengerModalProps {
  open: boolean;
  onClose: () => void;
  bookingData: Partial<Booking> | null;
}

const PassengerModal: React.FC<PassengerModalProps> = ({ open, onClose, bookingData }) => {
  if (!open || !bookingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="relative bg-white rounded-2.5xl shadow-modal w-full max-w-sm overflow-hidden animate-slide-up border border-slate-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Seats & Passengers</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Booking Details</p>
          </div>
          <button onClick={onClose} className="btn-icon w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-3.5 max-h-96 overflow-y-auto">
          {bookingData?.seat_record?.length ? (
            bookingData.seat_record.map((seat, index) => (
              <div key={index} className="flex items-center justify-between p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-100 rounded-xl hover:border-primary-100 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shadow-sm">
                    <span className="text-xs font-extrabold text-primary-700">{seat}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {bookingData.person?.[index] || '—'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Passenger #{index + 1}</span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm uppercase tracking-wider ${
                    bookingData.status?.[index]
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}
                >
                  {bookingData.status?.[index] ? 'Booked' : 'Cancelled'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 font-medium">No seat data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerModal;
