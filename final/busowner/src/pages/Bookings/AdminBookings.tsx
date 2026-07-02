import React from 'react';
import { useAdminBookings } from './hooks/useAdminBookings';
import PassengerModal from '../../components/modals/PassengerModal';
import FullPageLoader from '../../components/common/FullPageLoader';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

const today = new Date().toISOString().split('T')[0];

export const AdminBookings: React.FC = () => {
  const {
    isLoading,
    date,
    setDate,
    selectedBus,
    setSelectedBus,
    filteredBookings,
    searchId,
    setSearchId,
    passengerModal,
    openPassengerModal,
    closePassengerModal,
    findBookings,
    selectOptions,
  } = useAdminBookings();

  return (
    <div className="page-container max-w-6xl">
      <div className="mb-6">
        <h1 className="page-title">View Seat Availability</h1>
        <p className="text-sm text-slate-500 mt-0.5">Search bookings by bus and date</p>
      </div>

      <div className="card p-5 mb-6 bg-white shadow-md rounded-2xl border border-slate-100">
        <form onSubmit={findBookings} className="flex flex-col sm:flex-row gap-3 items-end">
          <SelectField
            label="Select Bus"
            options={selectOptions}
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            placeholder="Choose a bus..."
            containerCls="flex-1"
            required
          />
          <InputField
            label="Journey Date"
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            containerCls="flex-1"
            required
          />
          <button type="submit" className="btn-primary h-[42px] px-6 font-semibold flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {filteredBookings.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
            </p>
            <div className="relative">
              <InputField
                type="text"
                placeholder="Filter by booking ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                containerCls="w-56"
                className="pl-9 pr-7 text-xs"
                icon={
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                rightElement={
                  searchId && (
                    <button
                      type="button"
                      onClick={() => setSearchId('')}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )
                }
              />
            </div>
          </div>

          <div className="card overflow-hidden bg-white shadow-md rounded-2xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Booking ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Destination</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Distance</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Passengers</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((item, ind) => (
                    <tr key={item._id || ind} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{item._id}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700">{item.src}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700">{item.dist}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-600">₹{item.total_money}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-medium">{item.total_distance} km</td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => openPassengerModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Seats
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {filteredBookings.length === 0 && !isLoading && selectedBus && (
        <div className="card p-12 text-center bg-white shadow-md rounded-2xl border border-slate-100 mt-4">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">No bookings found for this date</p>
          </div>
        </div>
      )}

      <PassengerModal
        open={passengerModal.open}
        onClose={closePassengerModal}
        bookingData={passengerModal.data}
      />
      <FullPageLoader open={isLoading} />
    </div>
  );
};

export default AdminBookings;
