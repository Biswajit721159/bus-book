import React from 'react';

// Unified Premium Spinner Component matching bus-book
export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'white' | 'rose' | 'amber' | 'emerald';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-[3px]',
    lg: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-4',
  };

  const colorMap = {
    blue: 'border-blue-100 border-t-blue-600',
    white: 'border-white/30 border-t-white',
    rose: 'border-rose-100 border-t-rose-600',
    amber: 'border-amber-100 border-t-amber-600',
    emerald: 'border-emerald-100 border-t-emerald-600',
  };

  return (
    <div
      className={`${sizeMap[size] || sizeMap.md} rounded-full ${colorMap[color] || colorMap.blue} animate-spin flex-shrink-0 ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};

export interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  overlay?: boolean;
  text?: string;
}

// In-Page & Standalone Card Loader
export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  className = '',
  overlay = false,
  text = 'Loading...',
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3.5 p-4 animate-fade-in text-center ${className}`}>
      {/* Brand bus icon inside glowing spinner ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100/80 shadow-xs flex items-center justify-center text-blue-600">
          <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
          </svg>
        </div>
        <div className="absolute -inset-2 rounded-3xl border-2 border-blue-500/20 border-t-blue-600 animate-spin pointer-events-none" />
      </div>

      {text && (
        <div className="space-y-0.5">
          <p className="text-sm font-extrabold text-slate-800 tracking-tight">{text}</p>
          <p className="text-[11px] text-slate-400 font-medium">Please wait a moment</p>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl px-4 py-2.5 animate-slide-in pointer-events-none">
        <Spinner size="sm" color="blue" />
        <span className="text-xs font-bold text-slate-700">{text}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-6 px-4 animate-fade-in">
      {content}
    </div>
  );
};

export default Loader;
