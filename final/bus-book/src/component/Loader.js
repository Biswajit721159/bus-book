import React from 'react';

const Loader = ({ fullPage = true, size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-primary-200 border-t-primary-600 animate-spin`}
      />
      {text && <p className="text-sm text-surface-500 font-medium">{text}</p>}
    </div>
  );

  if (!fullPage) return spinner;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;
