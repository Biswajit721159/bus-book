import React, { useState } from 'react';

interface OtpFormProps {
  onVerify: (otp: string) => void;
  onResend: () => void;
  resendDisabled: boolean;
  resendCountdown: number;
  loading: boolean;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  onVerify,
  onResend,
  resendDisabled,
  resendCountdown,
  loading,
}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 text-center">
            Enter 6-Digit Security Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(val);
            }}
            placeholder="······"
            className="w-full py-3.5 px-4 text-center text-3xl font-mono font-black tracking-[0.5em] text-slate-900 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-2 border-slate-200 focus:border-blue-600 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 shadow-xs"
            disabled={loading}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full py-3.5 px-6 text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100 w-full">
        <span>Didn't receive the code? </span>
        <button
          type="button"
          onClick={onResend}
          disabled={resendDisabled || loading}
          className={`font-bold transition-colors cursor-pointer ${
            resendDisabled || loading
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          {resendDisabled && resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code Now'}
        </button>
      </div>
    </div>
  );
};

export default OtpForm;
