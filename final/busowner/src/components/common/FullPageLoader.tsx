import React from 'react';

interface FullPageLoaderProps {
  open: boolean;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({ open }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }}
      aria-label="Loading"
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <span className="text-sm font-medium text-white">Loading...</span>
      </div>
    </div>
  );
};
export default FullPageLoader;
