import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import {
  setCurrentPage,
  resetBookingFilters,
  useGetBookingsQuery,
} from '../../store/slices/bookingSlice';
import BookingTable from '../../components/tables/BookingTable';
import Loader, { Spinner } from '../../components/common/Loader';
import CalendarPicker from '../../components/forms/CalendarPicker';
import { BookingQuery } from '../../types/booking';
import { busApi } from '../../services/apiService';
import type { Bus } from '../../types/bus';


// ─── Suggestion Dropdown Input ──────────────────────────────────────────────────
interface SuggestionInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  suggestions: string[];
  icon: string;
  loading?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SuggestionInput: React.FC<SuggestionInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  icon,
  loading = false,
  onKeyDown,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!value.trim()) return suggestions.slice(0, 8);
    const q = value.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
  }, [value, suggestions]);

  const showDropdown = isFocused && (filtered.length > 0 || loading);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          )}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          className={`w-full pl-9 pr-8 py-2 text-xs font-medium text-slate-900 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl placeholder:text-slate-400 placeholder:font-normal transition-all duration-200 focus:outline-none focus:ring-2 border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-500/10`}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsFocused(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-fade-in">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(item);
                setIsFocused(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer ${
                idx < filtered.length - 1 ? 'border-b border-slate-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                <span>{item}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Super Admin Bookings Page ─────────────────────────────────────────────
export const SuperAdminBookings: React.FC = () => {
  const { Src, Dist, BookingDate, BusName, currentPage } = useSelector(
    (state: RootState) => state.booking
  );
  const dispatch = useDispatch();

  // Search input state (PNR / Booking ID)
  type SearchMode = 'all' | 'pnr' | 'bookingId';
  const [searchMode, setSearchMode] = useState<SearchMode>('all');
  const [searchInput, setSearchInput] = useState<string>('');

  // Local draft filter inputs (do NOT auto-query until Search is clicked)
  const [srcInput, setSrcInput] = useState<string>(Src || '');
  const [distInput, setDistInput] = useState<string>(Dist || '');
  const [busNameInput, setBusNameInput] = useState<string>(BusName || '');
  const [dateInput, setDateInput] = useState<string>(BookingDate || '');

  // Bus data for suggestions
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busesLoading, setBusesLoading] = useState(true);

  // Load buses on mount for bus name + station suggestions
  useEffect(() => {
    const loadBuses = async () => {
      try {
        setBusesLoading(true);
        const res = await busApi.getAll();
        if (res?.data?.data) {
          setBuses(res.data.data);
        }
      } catch (e: any) {
        console.error('Failed to load buses for suggestions:', e);
      } finally {
        setBusesLoading(false);
      }
    };
    loadBuses();
  }, []);

  // Build suggestion lists from bus data
  const stationSuggestions = useMemo(() => {
    const stations = new Set<string>();
    buses.forEach((b) => {
      (b.station_data || []).forEach((st) => {
        if (st.station) stations.add(st.station);
      });
    });
    return Array.from(stations).sort();
  }, [buses]);

  const busNameSuggestions = useMemo(() => {
    return buses.map((b) => b.bus_name).filter(Boolean).sort();
  }, [buses]);

  // Active committed query params sent to RTK Query (only updated on Search click or Clear)
  const [committedQuery, setCommittedQuery] = useState<BookingQuery>({
    currentPage: 1,
  });

  const { data, error, isFetching } = useGetBookingsQuery(committedQuery);
  const bookingData = data?.data?.bookingData || [];
  const totalPage = data?.data?.totalPage || 0;

  useEffect(() => {
    if (error) {
      toast.warn((error as any)?.data?.message || 'An error occurred while fetching bookings');
    }
  }, [error]);

  // Explicit Search handler (triggers only when user clicks Search or presses Enter)
  const handleSearch = useCallback(() => {
    const cleanSearch = searchInput.trim();
    const cleanSrc = srcInput.trim();
    const cleanDist = distInput.trim();
    const cleanBusName = busNameInput.trim();
    const cleanDate = dateInput.trim();

    const pnr = searchMode === 'pnr' ? cleanSearch : undefined;
    const bookingId = searchMode === 'bookingId' ? cleanSearch : undefined;
    const search = searchMode === 'all' ? cleanSearch : undefined;

    setCommittedQuery({
      currentPage: 1,
      src: cleanSrc || undefined,
      dist: cleanDist || undefined,
      bookingDate: cleanDate || undefined,
      busName: cleanBusName || undefined,
      pnr: pnr || undefined,
      bookingId: bookingId || undefined,
      search: search || undefined,
    });
    dispatch(setCurrentPage(1));
  }, [searchInput, searchMode, srcInput, distInput, busNameInput, dateInput, dispatch]);

  const onChangePage = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPage) return;
      dispatch(setCurrentPage(newPage));
      setCommittedQuery((prev) => ({ ...prev, currentPage: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [dispatch, totalPage]
  );

  // Clear all filters and immediately re-query
  const handleClearAll = useCallback(() => {
    setSearchInput('');
    setSrcInput('');
    setDistInput('');
    setBusNameInput('');
    setDateInput('');
    setSearchMode('all');
    setCommittedQuery({
      currentPage: 1,
    });
    dispatch(resetBookingFilters());
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  // Clear single filter pill and immediately re-query
  const handleRemoveActiveFilter = useCallback(
    (field: 'search' | 'src' | 'dist' | 'busName' | 'date') => {
      let nextSearch = searchInput;
      let nextSrc = srcInput;
      let nextDist = distInput;
      let nextBusName = busNameInput;
      let nextDate = dateInput;

      if (field === 'search') {
        nextSearch = '';
        setSearchInput('');
      } else if (field === 'src') {
        nextSrc = '';
        setSrcInput('');
      } else if (field === 'dist') {
        nextDist = '';
        setDistInput('');
      } else if (field === 'busName') {
        nextBusName = '';
        setBusNameInput('');
      } else if (field === 'date') {
        nextDate = '';
        setDateInput('');
      }

      const cleanSearch = nextSearch.trim();
      const pnr = searchMode === 'pnr' ? cleanSearch : undefined;
      const bookingId = searchMode === 'bookingId' ? cleanSearch : undefined;
      const search = searchMode === 'all' ? cleanSearch : undefined;

      setCommittedQuery({
        currentPage: 1,
        src: nextSrc.trim() || undefined,
        dist: nextDist.trim() || undefined,
        bookingDate: nextDate.trim() || undefined,
        busName: nextBusName.trim() || undefined,
        pnr: pnr || undefined,
        bookingId: bookingId || undefined,
        search: search || undefined,
      });
      dispatch(setCurrentPage(1));
    },
    [searchInput, srcInput, distInput, busNameInput, dateInput, searchMode, dispatch]
  );

  const hasAnyDraft = Boolean(searchInput || srcInput || distInput || busNameInput || dateInput);
  const hasAnyActiveFilter = Boolean(
    committedQuery.search ||
      committedQuery.pnr ||
      committedQuery.bookingId ||
      committedQuery.src ||
      committedQuery.dist ||
      committedQuery.busName ||
      committedQuery.bookingDate
  );

  // Compute results summary
  const totalResults = bookingData.length;
  const showingFrom = totalResults > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const showingTo = totalResults > 0 ? (currentPage - 1) * 10 + totalResults : 0;

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-sm relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Booking Management
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1.5 sm:ml-10">
            Search and manage all passenger bookings across the platform
          </p>
        </div>
        {totalPage > 0 && (
          <div className="px-4 py-2 rounded-xl bg-primary-50 border border-primary-200/60">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block">
              Total Pages
            </span>
            <span className="text-lg font-black text-primary-700">{totalPage}</span>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="card p-5 mb-6 bg-gradient-to-br from-white to-slate-50/50 shadow-sm border border-slate-100/80 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Filter Bookings
            </span>
          </div>
          {hasAnyActiveFilter && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* Search by PNR & Booking ID with explicit Search Button */}
        <div className="mb-4 pb-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search by PNR or Booking ID
            </label>
            {/* Search Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setSearchMode('all')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  searchMode === 'all'
                    ? 'bg-white text-primary-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All (PNR / ID)
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('pnr')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  searchMode === 'pnr'
                    ? 'bg-white text-primary-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                PNR Only
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('bookingId')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  searchMode === 'bookingId'
                    ? 'bg-white text-primary-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Booking ID Only
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={
                  searchMode === 'pnr'
                    ? 'Enter PNR number and click Search...'
                    : searchMode === 'bookingId'
                    ? 'Enter Booking ID and click Search...'
                    : 'Enter PNR or Booking ID and click Search...'
                }
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="w-full pl-10 pr-9 py-2.5 text-xs font-medium text-slate-900 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-xl placeholder:text-slate-400 transition-all outline-hidden shadow-xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  aria-label="Clear search input"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Quick Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {isFetching ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span>Search</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Source with suggestions */}
          <SuggestionInput
            label="Source Station"
            placeholder="Search source..."
            value={srcInput}
            onChange={setSrcInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            suggestions={stationSuggestions}
            loading={busesLoading}
            icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />

          {/* Destination with suggestions */}
          <SuggestionInput
            label="Destination Station"
            placeholder="Search destination..."
            value={distInput}
            onChange={setDistInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            suggestions={stationSuggestions}
            loading={busesLoading}
            icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />

          {/* Bus Name with suggestions */}
          <SuggestionInput
            label="Bus Name"
            placeholder="Search bus..."
            value={busNameInput}
            onChange={setBusNameInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            suggestions={busNameSuggestions}
            loading={busesLoading}
            icon="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />

          {/* Date Filter using CalendarPicker */}
          <div className="relative">
            <CalendarPicker
              label="Journey Date"
              value={dateInput}
              onChange={setDateInput}
              minDate=""
            />
            {dateInput && (
              <button
                type="button"
                onClick={() => setDateInput('')}
                className="absolute top-0 right-0 mt-0.5 text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Action Row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              {isFetching ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              Apply Filters
            </button>
            {hasAnyDraft && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            💡 Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-semibold text-slate-600">Enter</kbd> or click <span className="font-semibold text-slate-600">Search</span> to apply
          </span>
        </div>

        {/* Active filter pills (shows only what is currently searched) */}
        {hasAnyActiveFilter && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
            {(committedQuery.search || committedQuery.pnr || committedQuery.bookingId) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-[11px] font-bold text-primary-700">
                {committedQuery.pnr ? 'PNR: ' : committedQuery.bookingId ? 'Booking ID: ' : 'Search: '}
                {committedQuery.pnr || committedQuery.bookingId || committedQuery.search}
                <button
                  type="button"
                  onClick={() => handleRemoveActiveFilter('search')}
                  className="hover:text-primary-900 cursor-pointer ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {committedQuery.src && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
                Source: {committedQuery.src}
                <button
                  type="button"
                  onClick={() => handleRemoveActiveFilter('src')}
                  className="hover:text-blue-900 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {committedQuery.dist && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                Dest: {committedQuery.dist}
                <button
                  type="button"
                  onClick={() => handleRemoveActiveFilter('dist')}
                  className="hover:text-emerald-900 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {committedQuery.busName && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700">
                Bus: {committedQuery.busName}
                <button
                  type="button"
                  onClick={() => handleRemoveActiveFilter('busName')}
                  className="hover:text-indigo-900 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {committedQuery.bookingDate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700">
                Date: {new Date(committedQuery.bookingDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                <button
                  type="button"
                  onClick={() => handleRemoveActiveFilter('date')}
                  className="hover:text-amber-900 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Info Bar */}
      {!isFetching && bookingData.length > 0 && (
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-[11px] font-semibold text-slate-500">
            Showing <span className="font-bold text-slate-700">{showingFrom}–{showingTo}</span> results
            {totalPage > 1 && (
              <span> · Page <span className="font-bold text-slate-700">{currentPage}</span> of <span className="font-bold text-slate-700">{totalPage}</span></span>
            )}
          </p>
          {isFetching && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600">
              <div className="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              Loading...
            </div>
          )}
        </div>
      )}

      {/* Booking Table or Normal Inline Loader */}
      {isFetching && bookingData.length === 0 ? (
        <div className="card p-12 bg-white rounded-2xl border border-slate-100 shadow-sm mt-6">
          <Loader text="Loading passenger bookings..." />
        </div>
      ) : (
        <div className={`relative transition-opacity duration-200 ${isFetching ? 'opacity-70 pointer-events-none' : ''}`}>
          <BookingTable data={bookingData} />
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-2xl z-10">
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-200 animate-fade-in">
                <Spinner size="sm" color="blue" />
                <span className="text-xs font-bold text-slate-700">Updating bookings...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white rounded-2xl border border-slate-100/80 shadow-sm">
          {/* Results counter */}
          <p className="text-[11px] font-semibold text-slate-500">
            Page <span className="font-bold text-slate-700">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-700">{totalPage}</span>
          </p>

          {/* Page buttons */}
          <div className="flex items-center gap-1.5">
            {/* First page */}
            <button
              type="button"
              onClick={() => onChangePage(1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-xs font-bold"
              title="First page"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            {/* Previous */}
            <button
              type="button"
              onClick={() => onChangePage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
            {(() => {
              const pages: (number | '...')[] = [];
              if (totalPage <= 7) {
                for (let i = 1; i <= totalPage; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 4) pages.push('...');
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPage - 1, currentPage + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (currentPage < totalPage - 3) pages.push('...');
                pages.push(totalPage);
              }

              return pages.map((p, idx) =>
                p === '...' ? (
                  <span key={`dots-${idx}`} className="px-1 text-slate-400 text-xs font-bold select-none">
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChangePage(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      p === currentPage
                        ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700'
                    }`}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            {/* Next */}
            <button
              type="button"
              onClick={() => onChangePage(currentPage + 1)}
              disabled={currentPage >= totalPage}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last page */}
            <button
              type="button"
              onClick={() => onChangePage(totalPage)}
              disabled={currentPage >= totalPage}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-xs font-bold"
              title="Last page"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Jump to page */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-500">Go to:</label>
            <input
              type="number"
              min={1}
              max={totalPage}
              className="w-16 px-2 py-1 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-center"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt((e.target as HTMLInputElement).value);
                  if (val >= 1 && val <= totalPage) {
                    onChangePage(val);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              placeholder={String(currentPage)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminBookings;
