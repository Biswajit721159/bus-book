import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stationSchema, type StationFormData } from '../../../lib/validationSchemas';
import InputField from '../../../components/forms/InputField';
import type { StationData } from '../../../types/bus';
import {
  calculateEstimatedArrival,
  getQuickOffsetTimes,
  analyzeJourney,
  minutesToTime,
  parseTimeToMinutes,
  POPULAR_DEPARTURE_TIMES,
  POPULAR_TRANSIT_STATIONS,
} from '../utils/timeSuggestion';

interface StationFormProps {
  onAdd: (station: string, arrivedTime: string, distance: number, isLast: boolean) => void;
  isFirst: boolean;
  previousStation?: StationData;
  stationIndex?: number;
}

export const StationForm: React.FC<StationFormProps> = ({
  onAdd,
  isFirst,
  previousStation,
  stationIndex = 1,
}) => {
  const [speedProfile, setSpeedProfile] = useState<number>(50); // 50 km/h default
  const [appliedFlash, setAppliedFlash] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const watchedDistance = watch('Distance_from_Previous_Station');
  const watchedArrivedTime = watch('arrived_time');
  const watchedStation = watch('station');

  const distanceNum = Math.max(0, Number(watchedDistance) || 0);

  // Auto-calculated arrival estimate based on distance & previous station
  const arrivalEstimate = useMemo(() => {
    if (isFirst || !previousStation?.arrived_time || distanceNum <= 0) {
      return null;
    }
    return calculateEstimatedArrival(previousStation.arrived_time, distanceNum, speedProfile);
  }, [isFirst, previousStation?.arrived_time, distanceNum, speedProfile]);

  // Quick relative offset chips (+30m, +1h, etc.)
  const quickOffsets = useMemo(() => {
    if (isFirst || !previousStation?.arrived_time) return [];
    return getQuickOffsetTimes(previousStation.arrived_time);
  }, [isFirst, previousStation?.arrived_time]);

  // Sanity analysis on current arrival time vs previous station
  const journeyAnalysis = useMemo(() => {
    if (isFirst || !previousStation?.arrived_time || !watchedArrivedTime) return null;
    return analyzeJourney(previousStation.arrived_time, watchedArrivedTime, distanceNum);
  }, [isFirst, previousStation?.arrived_time, watchedArrivedTime, distanceNum]);

  // Filter matching transit stations for autocomplete chips
  const matchingStations = useMemo(() => {
    const query = (watchedStation || '').trim().toUpperCase();
    if (!query || query.length < 2) return [];
    return POPULAR_TRANSIT_STATIONS.filter(
      (name) => name.includes(query) && name !== query
    ).slice(0, 4);
  }, [watchedStation]);

  // Handlers for applying suggested times
  const applyTime = (time: string) => {
    setValue('arrived_time', time, { shouldValidate: true });
    setAppliedFlash(true);
    setTimeout(() => setAppliedFlash(false), 1200);
  };

  const applyCurrentTime = () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    applyTime(`${hh}:${mm}`);
  };

  const adjustMinutes = (delta: number) => {
    const currentMins = parseTimeToMinutes(watchedArrivedTime) ?? parseTimeToMinutes('10:00') ?? 600;
    applyTime(minutesToTime(currentMins + delta));
  };

  const applyDistancePreset = (km: number) => {
    setValue('Distance_from_Previous_Station', km, { shouldValidate: true });
    // If arrival time is empty or was previously auto-estimated, calculate immediately
    if (previousStation?.arrived_time) {
      const est = calculateEstimatedArrival(previousStation.arrived_time, km, speedProfile);
      if (est) {
        applyTime(est.arrivalTime);
      }
    }
  };

  const onSubmitForm = (data: StationFormData) => {
    onAdd(
      data.station.toUpperCase().trim(),
      data.arrived_time,
      isFirst ? 0 : Number(data.Distance_from_Previous_Station) || 0,
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
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="card p-6 bg-white shadow-md rounded-2xl border border-slate-100 animate-fade-in space-y-5"
      noValidate
    >
      {/* Station Form Header & Previous Station Context */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              #{stationIndex}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {isFirst ? 'Add Origin Station (Departure Point)' : 'Add Next Station'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {isFirst ? 'Route Start (0 km)' : `Station #${stationIndex}`}
          </span>
        </div>

        {/* Previous Stop Banner for Context */}
        {!isFirst && previousStation && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/90 border border-blue-200/80 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <span className="text-slate-500 font-medium">Departing from previous stop:</span>
              <span className="font-bold text-blue-900 text-xs tracking-wide">
                {previousStation.station}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Departure / Arrival Time:</span>
              <span className="font-bold text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-xs">
                {previousStation.arrived_time}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main 3 Input Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Station Name */}
        <div className="space-y-1.5">
          <InputField
            id="stationName"
            type="text"
            label="Station Name"
            placeholder="e.g. MUMBAI, PUNE, MANMAD"
            error={errors.station?.message}
            {...register('station')}
          />
          {/* Station Auto-suggestions */}
          {matchingStations.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-semibold text-slate-400">Suggest:</span>
              {matchingStations.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setValue('station', city, { shouldValidate: true })}
                  className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Distance from Prev. Station */}
        <div className="space-y-1.5">
          <InputField
            id="distance"
            type="number"
            label={isFirst ? 'Distance (Origin: 0 km)' : 'Distance from Prev. (km)'}
            placeholder="0"
            disabled={isFirst}
            className={isFirst ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}
            error={errors.Distance_from_Previous_Station?.message}
            {...register('Distance_from_Previous_Station', { valueAsNumber: true })}
          />
          {!isFirst && (
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              <span className="text-[10px] font-semibold text-slate-400">Presets:</span>
              {[25, 50, 100, 120, 150, 200].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => applyDistancePreset(km)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded border transition-colors ${
                    distanceNum === km
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {km}km
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Arrival Time (24h) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="arrivedTime" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              {isFirst ? 'Departure Time (24h)' : 'Arrival Time (24h)'}
            </label>
            {/* Quick +/- 15 min steppers */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => adjustMinutes(-15)}
                title="Subtract 15 minutes"
                className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                -15m
              </button>
              <button
                type="button"
                onClick={() => adjustMinutes(15)}
                title="Add 15 minutes"
                className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                +15m
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              id="arrivedTime"
              type="time"
              className={`w-full py-2 px-3 text-xs font-medium text-slate-900 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                appliedFlash
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                  : errors.arrived_time
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 bg-rose-50/20'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-500/10'
              }`}
              {...register('arrived_time')}
            />
            {appliedFlash && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded animate-pulse">
                ✓ Applied
              </span>
            )}
          </div>
          {errors.arrived_time && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.arrived_time.message}</p>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SMART ARRIVAL TIME SUGGESTION SECTION (For Subsequent Stations)        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {!isFirst && previousStation?.arrived_time && (
        <div className="space-y-3 pt-1">
          {/* Primary Distance-Based Auto-Estimate Card */}
          {distanceNum > 0 && arrivalEstimate && (
            <div className="p-3.5 bg-gradient-to-r from-blue-50 via-indigo-50/90 to-blue-50 border border-blue-200 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Estimated Arrival Time:</span>
                      <span className="text-sm font-bold text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-xs">
                        {arrivalEstimate.arrivalTime}
                      </span>
                      {arrivalEstimate.isNextDay && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          🌙 Next Day (+1 Day)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Travel time: <span className="font-bold text-slate-700">{arrivalEstimate.formattedDuration}</span> for{' '}
                      <span className="font-bold text-slate-700">{distanceNum} km</span> from {previousStation.station} (at {speedProfile} km/h + 5m stop)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Speed Profile Toggle */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSpeedProfile(40)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        speedProfile === 40 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
                      }`}
                      title="City/Hills average speed 40 km/h"
                    >
                      40 km/h
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeedProfile(50)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        speedProfile === 50 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
                      }`}
                      title="Standard highway average speed 50 km/h"
                    >
                      50 km/h (Normal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeedProfile(60)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        speedProfile === 60 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
                      }`}
                      title="Express highway average speed 60 km/h"
                    >
                      60 km/h (Exp)
                    </button>
                  </div>

                  {/* One-Click Apply Button */}
                  <button
                    type="button"
                    onClick={() => applyTime(arrivalEstimate.arrivalTime)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <span>Apply {arrivalEstimate.arrivalTime}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick-Add Offset Chips from Previous Station */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <span>🕒</span>
                <span>Quick Arrival Time Suggestions</span>
              </span>
              <span className="text-slate-400 font-medium">
                Relative to {previousStation.station} departure ({previousStation.arrived_time})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {quickOffsets.map((offset) => {
                const isActive = watchedArrivedTime === offset.time;
                return (
                  <button
                    key={offset.label}
                    type="button"
                    onClick={() => applyTime(offset.time)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-normal">{offset.label}:</span>
                    <span>{offset.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Sanity Check & 12h/24h AM/PM Warning Callout                        */}
          {/* (Fixes issues like Mumbai 10:00 -> Pune 00:19 in user's screenshot) */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {journeyAnalysis && journeyAnalysis.isLikely12HourMixup && journeyAnalysis.suggested12HourFix && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-slide-up">
              <div className="flex items-start gap-2 text-amber-900">
                <span className="text-base flex-shrink-0">⚠️</span>
                <div>
                  <p className="font-bold text-amber-900">
                    Possible 12-Hour (AM/PM) Schedule Mixup Detected
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Arrival at <span className="font-bold text-amber-900">{watchedArrivedTime}</span> is {journeyAnalysis.formattedDuration} after {previousStation.station} (10:00).
                    Did you mean <span className="font-bold text-amber-900">{journeyAnalysis.suggested12HourFix}</span> (PM)?
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => applyTime(journeyAnalysis.suggested12HourFix!)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Switch to {journeyAnalysis.suggested12HourFix}
                </button>
                {arrivalEstimate && (
                  <button
                    type="button"
                    onClick={() => applyTime(arrivalEstimate.arrivalTime)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100"
                  >
                    Use Est. {arrivalEstimate.arrivalTime}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Live Journey Progress Summary when valid */}
          {journeyAnalysis && !journeyAnalysis.isLikely12HourMixup && (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Route Segment:</span>
                <span className="font-bold text-slate-700">{previousStation.station} ({previousStation.arrived_time})</span>
                <span className="text-blue-500">&rarr;</span>
                <span className="font-bold text-slate-700">
                  {watchedStation ? watchedStation.toUpperCase() : 'Next Stop'} ({watchedArrivedTime})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Duration: <strong className="text-slate-700">{journeyAnalysis.formattedDuration}</strong></span>
                {journeyAnalysis.impliedSpeedKmH && (
                  <span className="text-slate-400">· Avg: <strong className="text-slate-700">{journeyAnalysis.impliedSpeedKmH} km/h</strong></span>
                )}
                {journeyAnalysis.isNextDay && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    +1 Day
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* POPULAR DEPARTURE TIME PRESETS (When Adding First Origin Station)     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {isFirst && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <span>🌅</span>
              <span>Popular Origin Departure Times</span>
            </span>
            <span className="text-slate-400 font-medium">One-click schedule setup</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {POPULAR_DEPARTURE_TIMES.map((time) => {
              const isActive = watchedArrivedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => applyTime(time)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {time}
                </button>
              );
            })}
            <button
              type="button"
              onClick={applyCurrentTime}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            >
              Current Time
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* FORM ACTION FOOTER                                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            {...register('isLastStation')}
          />
          <span className="text-xs font-bold text-slate-700">This is the last station (Destination)</span>
        </label>
        <button
          type="submit"
          className="btn-primary flex items-center gap-2 py-2 px-5 text-xs font-bold shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isFirst ? 'Set Origin Station' : 'Add Station'}
        </button>
      </div>
    </form>
  );
};

export default StationForm;
