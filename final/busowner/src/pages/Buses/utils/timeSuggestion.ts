/**
 * Utility functions for smart Arrival Time suggestions, duration estimation,
 * and schedule sanity validation for bus route station management.
 */

export interface ArrivalEstimate {
  arrivalTime: string;
  durationMinutes: number;
  formattedDuration: string;
  isNextDay: boolean;
  dayOffset: number;
}

export interface QuickOffset {
  label: string;
  minutes: number;
  time: string;
}

export interface JourneyAnalysis {
  elapsedMinutes: number;
  formattedDuration: string;
  impliedSpeedKmH: number | null;
  isNextDay: boolean;
  isLikely12HourMixup: boolean;
  suggested12HourFix: string | null;
}

/**
 * Parse HH:mm (24-hour string) into total minutes from 00:00.
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return hours * 60 + minutes;
}

/**
 * Format total minutes (wrapping 1440 mins per 24 hours) to 'HH:mm' 24-hour string.
 */
export function minutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Calculate estimated arrival time based on previous station time, distance, and bus speed.
 * @param prevTimeStr Previous station departure / arrival time (HH:mm)
 * @param distanceKm Distance in kilometers from previous station
 * @param speedKmH Average commercial bus speed (default: 50 km/h)
 * @param haltMinutes Estimated halt / passenger boarding buffer (default: 5 mins)
 */
export function calculateEstimatedArrival(
  prevTimeStr: string,
  distanceKm: number,
  speedKmH: number = 50,
  haltMinutes: number = 5
): ArrivalEstimate | null {
  const prevMinutes = parseTimeToMinutes(prevTimeStr);
  if (prevMinutes === null || distanceKm <= 0 || speedKmH <= 0) {
    return null;
  }

  // Pure driving duration in minutes + halt buffer
  const drivingMinutes = Math.round((distanceKm / speedKmH) * 60);
  const totalDurationMinutes = Math.max(5, drivingMinutes + haltMinutes);

  const totalArrivalMinutes = prevMinutes + totalDurationMinutes;
  const arrivalTime = minutesToTime(totalArrivalMinutes);

  const hours = Math.floor(totalDurationMinutes / 60);
  const mins = totalDurationMinutes % 60;
  const formattedDuration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const isNextDay = totalArrivalMinutes >= 1440;
  const dayOffset = Math.floor(totalArrivalMinutes / 1440);

  return {
    arrivalTime,
    durationMinutes: totalDurationMinutes,
    formattedDuration,
    isNextDay,
    dayOffset,
  };
}

/**
 * Generate relative time offsets from the previous station's arrival time.
 */
export function getQuickOffsetTimes(prevTimeStr: string): QuickOffset[] {
  const prevMinutes = parseTimeToMinutes(prevTimeStr);
  if (prevMinutes === null) return [];

  const offsets = [
    { label: '+30m', minutes: 30 },
    { label: '+1h', minutes: 60 },
    { label: '+1.5h', minutes: 90 },
    { label: '+2h', minutes: 120 },
    { label: '+2.5h', minutes: 150 },
    { label: '+3h', minutes: 180 },
    { label: '+4h', minutes: 240 },
    { label: '+5h', minutes: 300 },
  ];

  return offsets.map((o) => ({
    label: o.label,
    minutes: o.minutes,
    time: minutesToTime(prevMinutes + o.minutes),
  }));
}

/**
 * Analyze journey between two stations to check duration, speed, and potential 12h/24h mistakes.
 */
export function analyzeJourney(
  prevTimeStr: string,
  currentTimeStr: string,
  distanceKm: number
): JourneyAnalysis | null {
  const prevMinutes = parseTimeToMinutes(prevTimeStr);
  const currentMinutes = parseTimeToMinutes(currentTimeStr);

  if (prevMinutes === null || currentMinutes === null) return null;

  let elapsedMinutes = currentMinutes - prevMinutes;
  let isNextDay = false;

  if (elapsedMinutes < 0) {
    // Crosses midnight
    elapsedMinutes += 1440;
    isNextDay = true;
  }

  const hours = Math.floor(elapsedMinutes / 60);
  const mins = elapsedMinutes % 60;
  const formattedDuration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const impliedSpeedKmH =
    distanceKm > 0 && elapsedMinutes > 0
      ? Math.round((distanceKm / (elapsedMinutes / 60)) * 10) / 10
      : null;

  // Detect likely 12h AM/PM mixup:
  // e.g. Prev was 10:00, user typed 00:19 (14h 19m) for 122 km.
  // 12:19 would be 2h 19m -> 52.6 km/h (very normal highway speed).
  let isLikely12HourMixup = false;
  let suggested12HourFix: string | null = null;

  if (distanceKm > 0 && elapsedMinutes > 720 && impliedSpeedKmH && impliedSpeedKmH < 20) {
    // Check if adding/subtracting 12 hours gives a normal highway speed (30-80 km/h)
    const altCurrentMinutes = (currentMinutes + 720) % 1440;
    let altElapsedMinutes = altCurrentMinutes - prevMinutes;
    if (altElapsedMinutes < 0) altElapsedMinutes += 1440;

    const altSpeed = Math.round((distanceKm / (altElapsedMinutes / 60)) * 10) / 10;
    if (altSpeed >= 25 && altSpeed <= 90) {
      isLikely12HourMixup = true;
      suggested12HourFix = minutesToTime(altCurrentMinutes);
    }
  }

  return {
    elapsedMinutes,
    formattedDuration,
    impliedSpeedKmH,
    isNextDay,
    isLikely12HourMixup,
    suggested12HourFix,
  };
}

/**
 * Common departure times for the origin station.
 */
export const POPULAR_DEPARTURE_TIMES = [
  '06:00',
  '07:30',
  '09:00',
  '10:00',
  '12:00',
  '14:00',
  '16:30',
  '18:00',
  '20:00',
  '21:30',
  '22:30',
  '23:15',
];

/**
 * Popular transit stations for quick auto-complete and suggestions.
 */
export const POPULAR_TRANSIT_STATIONS = [
  'MUMBAI',
  'PUNE',
  'NASHIK',
  'MANMAD',
  'SHIRDI',
  'AURANGABAD',
  'NAGPUR',
  'SOLAPUR',
  'KOLHAPUR',
  'SATARA',
  'THANE',
  'SURAT',
  'VAPI',
  'AHMEDABAD',
  'VADODARA',
  'GOA',
  'PANAJI',
  'HYDERABAD',
  'BENGALURU',
  'BELGAUM',
  'INDORE',
];
