import React, { useState } from 'react';
import { useAdminBookings, getLocalToday, getLocalTomorrow } from './hooks/useAdminBookings';
import PassengerModal from '../../components/modals/PassengerModal';
import Loader, { Spinner } from '../../components/common/Loader';
import CalendarPicker from '../../components/forms/CalendarPicker';
import BusSeatMap from './components/BusSeatMap';
import ConductorManifestModal from './components/ConductorManifestModal';

const today = getLocalToday();
const tomorrow = getLocalTomorrow();

export const AdminBookings: React.FC = () => {
  const {
    busData,
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
    currentPage,
    fetchBookingsForPage,
    getSegmentDistance,
  } = useAdminBookings();

  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [manifestOpen, setManifestOpen] = useState(false);

  // Quick Date Helpers
  const handleSetQuickDate = (offsetDays: number) => {
    if (offsetDays === 0) {
      setDate(getLocalToday());
    } else if (offsetDays === 1) {
      setDate(getLocalTomorrow());
    } else {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  };

  const totalRevenue = filteredBookings.reduce((acc, curr) => acc + (curr.total_money || 0), 0);
  const totalSeatsBooked = filteredBookings.reduce((acc, curr) => {
    const validSeats = curr.seat_record?.filter((_, idx) => curr.status?.[idx] !== false) || [];
    return acc + validSeats.length;
  }, 0);

  return (
    <div className="page-container max-w-7xl animate-fade-in space-y-6">
      {/* Header Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-blue-900/10 border border-blue-600/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-blue-100 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Realtime Manifest
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Seat Availability & Bookings
            </h1>
            <p className="text-xs text-blue-100/90 max-w-lg font-medium">
              Inspect passenger manifests, verify paid tickets, and monitor occupied berths per departure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Selected Date</span>
              <span className="text-xs font-mono font-extrabold text-white">{date || today}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] p-4 sm:p-5">
        <form onSubmit={findBookings} className="flex flex-col lg:flex-row lg:items-end gap-3.5">
          {/* Bus Selector */}
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Bus Vehicle <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
                required
                className="w-full pl-3 pr-8 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">Choose a bus...</option>
                {selectOptions.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Professional Calendar Date Picker */}
          <div className="w-full sm:w-64">
            <CalendarPicker
              label="Journey Date"
              value={date}
              minDate={today}
              onChange={(newDate) => setDate(newDate)}
            />
          </div>

          {/* Quick Date Chips */}
          <div className="flex items-center gap-1.5 self-center sm:self-end pb-0.5">
            <button
              type="button"
              onClick={() => handleSetQuickDate(0)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                date === today
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleSetQuickDate(1)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                date === tomorrow
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tomorrow
            </button>
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedBus}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer shadow-sm hover:shadow-blue-500/20 self-stretch sm:self-end whitespace-nowrap h-[36px]"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Bookings</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Metrics Summary Strip (Visible when a bus is selected) */}
      {selectedBus && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 animate-fade-in">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 leading-tight">{filteredBookings.length}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Orders</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-black text-emerald-700 leading-tight">{totalSeatsBooked}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Seats Reserved</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 leading-tight">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Revenue</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight truncate">{selectedBus}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">{date}</p>
            </div>
          </div>
        </div>
      )}

      {/* View Switcher & Action Toolbar */}
      {selectedBus && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm animate-fade-in">
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Visual Seat Layout</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Manifest Table ({filteredBookings.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setManifestOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Conductor Manifest</span>
            </button>
          </div>
        </div>
      )}

      {/* Content Area: Loading or Loaded Views */}
      {isLoading && filteredBookings.length === 0 && selectedBus ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-12 animate-fade-in text-center">
          <Loader text="Loading passenger reservations..." />
        </div>
      ) : selectedBus ? (
        <div className={`relative transition-opacity duration-200 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
          {/* Visual Seat Map View */}
          {viewMode === 'map' && (
            <BusSeatMap
              totalSeats={busData.find((b) => b.bus_name === selectedBus)?.Total_seat || 40}
              bookings={filteredBookings}
              onSeatClick={openPassengerModal}
            />
          )}

          {/* Bookings Table Container */}
          {viewMode === 'table' && (
            filteredBookings.length > 0 ? (
              <div id="passenger-manifest-table" className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)] overflow-hidden animate-fade-in">
                {/* Table Header Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">Passenger Bookings List</h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {filteredBookings.length} confirmed reservation{filteredBookings.length !== 1 ? 's' : ''} found
                    </p>
                  </div>

                  {/* Quick Filter Box */}
                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search PNR, ID, passenger, or city..."
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    {searchId && (
                      <button
                        type="button"
                        onClick={() => setSearchId('')}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-200/80">
                        <th className="py-2.5 px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-10 text-center">#</th>
                        <th className="py-2.5 px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Booking ID / PNR</th>
                        <th className="py-2.5 px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Route</th>
                        <th className="py-2.5 px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fare Paid</th>
                        <th className="py-2.5 px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Distance</th>
                        <th className="py-2.5 px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Seats / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredBookings.map((item, ind) => {
                        const seatCount = item.seat_record?.length || 0;
                        return (
                          <tr key={item._id || ind} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-3 px-3.5 text-center font-bold text-[11px] text-slate-400">
                              {ind + 1}
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="flex flex-col">
                                <span className="font-mono text-[11px] font-bold text-slate-800">
                                  #{item._id}
                                </span>
                                <span className="text-[10px] font-bold text-indigo-600 truncate max-w-[180px]">
                                  PNR: {item.pnr_number || '—'}
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50/70 border border-blue-200/60 text-blue-900 font-bold text-[11px]">
                                <span>{item.src}</span>
                                <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <span>{item.dist}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-xs">₹{item.total_money}</span>
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 uppercase">
                                  Paid
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-3.5 text-slate-600 font-semibold text-[11px]">
                              {getSegmentDistance(item.src, item.dist)} km
                            </td>

                            <td className="py-3 px-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => openPassengerModal(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm"
                                title="View Seats & Passenger Details"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>View {seatCount} Seat{seatCount !== 1 ? 's' : ''}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Compact Pagination Bar */}
                <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Showing page <span className="font-bold text-slate-700">{currentPage}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        fetchBookingsForPage(currentPage - 1);
                        document.getElementById('passenger-manifest-table')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }}
                      disabled={currentPage <= 1 || isLoading}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Prev
                    </button>
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 text-white shadow-sm">
                      {currentPage}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        fetchBookingsForPage(currentPage + 1);
                        document.getElementById('passenger-manifest-table')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }}
                      disabled={filteredBookings.length < 10 || isLoading}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm animate-fade-in">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200/60">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-700">No Bookings Recorded Yet</p>
                  <p className="text-[11px] text-slate-400 max-w-sm">
                    There are currently no passenger reservations recorded for <span className="font-semibold text-slate-600">{selectedBus}</span> on <span className="font-semibold text-slate-600">{date}</span>. All seats are available for booking.
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all cursor-pointer"
                  >
                    Inspect Seat Layout
                  </button>
                </div>
              </div>
            )
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-2xl z-20">
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-200 animate-fade-in">
                <Spinner size="sm" color="blue" />
                <span className="text-xs font-bold text-slate-700">Updating reservations...</span>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Empty state when no bus selected yet */}
      {!isLoading && !selectedBus && (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs font-semibold text-slate-400">
            Select a bus and journey date above to review passenger seat availability and bookings.
          </p>
        </div>
      )}

      <PassengerModal
        open={passengerModal.open}
        onClose={closePassengerModal}
        bookingData={passengerModal.data}
      />
      <ConductorManifestModal
        open={manifestOpen}
        onClose={() => setManifestOpen(false)}
        busName={selectedBus}
        journeyDate={date || today}
        bookings={filteredBookings}
      />
    </div>
  );
};

export default AdminBookings;
