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
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 text-center">Enter 6-Digit OTP</label>
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
            placeholder="000000"
            className="w-full py-3 px-4 text-center text-3xl font-bold tracking-[0.5em] text-slate-900 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-0 focus:outline-none transition-all duration-200 shadow-sm"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 mb-6"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-500 mt-4">
        Didn't receive the code?{' '}
        <button
          type="button"
          onClick={onResend}
          disabled={resendDisabled || loading}
          className={`font-semibold transition-colors ${
            resendDisabled || loading
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-primary-600 hover:text-primary-700'
          }`}
        >
          {resendDisabled && resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default OtpForm;
