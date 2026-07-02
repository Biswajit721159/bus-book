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
      ? { title: 'Create an account', subtitle: 'Register as a bus owner or admin' }
      : {
          title: 'Verify your email',
          subtitle: (
            <>
              We&apos;ve sent a 6-digit verification code to <br />
              <span className="font-semibold text-slate-800">{emailForOtp}</span>
            </>
          ),
        };

  return (
    <AuthCard title={heading.title} subtitle={heading.subtitle} maxWidth="max-w-lg">
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
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              &larr; Back to Registration
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{' '}
          <Link to="/Login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      )}
    </AuthCard>
  );
};

export default Register;
