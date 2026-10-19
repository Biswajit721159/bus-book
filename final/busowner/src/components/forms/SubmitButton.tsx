import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  loadingLabel?: string;
  className?: string;
}

/**
 * Modern high-contrast submit button with smooth loading state
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  label,
  loadingLabel,
  className = '',
}) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`w-full py-3.5 px-6 text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${className}`}
  >
    {isLoading ? (
      <>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span>{loadingLabel ?? label}</span>
      </>
    ) : (
      <>
        <span>{label}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </>
    )}
  </button>
);

export default SubmitButton;
