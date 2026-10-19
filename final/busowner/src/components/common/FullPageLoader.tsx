import React from 'react';
import { Spinner } from './Loader';

interface FullPageLoaderProps {
  open: boolean;
  text?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({ open, text = 'Loading...' }) => {
  if (!open) return null;

  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl px-4 py-2.5 animate-slide-in pointer-events-none"
      aria-label="Loading"
      role="status"
    >
      <Spinner size="sm" color="blue" />
      <span className="text-xs font-bold text-slate-700">{text}</span>
    </div>
  );
};

export default FullPageLoader;

