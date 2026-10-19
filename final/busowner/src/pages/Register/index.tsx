import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from './hooks/useRegister';
import AuthCard from '../../components/auth/AuthCard';
import RegisterForm from './components/RegisterForm';
import OtpForm from '../../components/auth/OtpForm';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate(-1);
    }
  }, [navigate]);

  const {
    step,
    isLoading,
    resendCountdown,
    emailForOtp,
    onRegisterSubmit,
    onVerifyOtp,
    onResendOtp,
    goBack,
  } = useRegister();

  const heading =
    step === 1
      ? {
          title: 'Join as Fleet Partner',
          subtitle: 'Create your bus operator account to list routes, manage schedules, and accept daily passenger bookings.',
        }
      : {
          title: 'Verify Your Email Address',
          subtitle: (
            <span>
              We've sent a 6-digit verification code to <br />
              <strong className="text-slate-900 font-semibold">{emailForOtp}</strong>
            </span>
          ),
        };

  return (
    <AuthCard title={heading.title} subtitle={heading.subtitle} maxWidth="max-w-xl">
      {step === 1 ? (
        <RegisterForm onSubmit={onRegisterSubmit} isLoading={isLoading} />
      ) : (
        <div className="animate-fade-in">
          <OtpForm
            onVerify={onVerifyOtp}
            onResend={onResendOtp}
            resendDisabled={resendCountdown > 0}
            resendCountdown={resendCountdown}
            loading={isLoading}
          />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={goBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Registration Details</span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already registered as a bus operator? </span>
          <Link
            to="/Login"
            className="text-blue-600 hover:text-blue-700 font-bold transition-colors ml-1"
          >
            Sign in here ➔
          </Link>
        </div>
      )}
    </AuthCard>
  );
};

export default Register;
