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
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Seats & Passengers</h3>
          <button onClick={onClose} className="btn-icon text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-2 max-h-80 overflow-y-auto">
          {bookingData?.seat_record?.length ? (
            bookingData.seat_record.map((seat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-700">{seat}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {bookingData.person?.[index] || '—'}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    bookingData.status?.[index]
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {bookingData.status?.[index] ? 'Booked' : 'Cancelled'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No seat data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerModal;
