export function convertUtcToIst(utcDateStr: string): string {
  if (!utcDateStr) return '—';
  try {
    const utcDate = new Date(utcDateStr);
    if (isNaN(utcDate.getTime())) return '—';
    const offset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + offset);
    return istDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  } catch {
    return '—';
  }
}

export function convertUtcToIst2(utcDateStr: string): string {
  if (!utcDateStr) return '—';
  try {
    const utcDate = new Date(utcDateStr);
    if (isNaN(utcDate.getTime())) return '—';
    const offset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + offset);

    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  } catch {
    return '—';
  }
}

export const searchData = <T extends Record<string, any>>(
  data: T[],
  searchInput: string,
  searchField: keyof T
): T[] => {
  if (!data || !searchInput) return data || [];
  try {
    return data.filter((item) => {
      try {
        const val = item[searchField];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(searchInput.toLowerCase());
        }
        return String(val).match(new RegExp(searchInput, 'i')) !== null;
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
};

export function debounce<A extends any[], R>(
  fn: (...args: A) => R,
  ms: number
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}

export const logo = "https://img.freepik.com/free-vector/students-bus-school-cartoon-icon-isolated_24911-114330.jpg";
