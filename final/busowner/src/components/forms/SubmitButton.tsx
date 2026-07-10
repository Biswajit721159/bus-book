import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  loadingLabel?: string;
  className?: string;
}

/**
 * Reusable primary submit button with built-in loading spinner.
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
    className={`w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 ${className}`}
  >
    {isLoading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        {loadingLabel ?? label}
      </>
    ) : (
      <>
        {label}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </>
    )}
  </button>
);

export default SubmitButton;
