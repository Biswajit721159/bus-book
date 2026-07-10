import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import AuthCard from '../../components/auth/AuthCard';
import OtpForm from '../../components/auth/OtpForm';
import { LoginForm } from './components/LoginForm';
import { useLogin } from './hooks/useLogin';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const userinfo = useSelector((state: RootState) => state.userAuth.user);

  // Redirect if already logged in
  useEffect(() => {
    if (userinfo) navigate('/Dashboard');
  }, [userinfo, navigate]);

  const {
    step,
    isLoading,
    resendCountdown,
    emailForOtp,
    onLoginSubmit,
    onVerifyOtp,
    onResendOtp,
    onGoogleLogin,
    goBack,
  } = useLogin();

  const heading =
    step === 1
      ? { title: 'Welcome back', subtitle: 'Sign in to your account' }
      : {
          title: 'Enter OTP',
          subtitle: (
            <>
              We&apos;ve sent a 6-digit code to{' '}
              <span className="font-semibold text-slate-800">{emailForOtp}</span>
            </>
          ),
        };

  return (
    <AuthCard title={heading.title} subtitle={heading.subtitle}>
      {step === 1 ? (
        <LoginForm onSubmit={onLoginSubmit} isLoading={isLoading} onGoogleLogin={onGoogleLogin} />
      ) : (
        <div className="animate-fade-in">
          <OtpForm
            onVerify={onVerifyOtp}
            onResend={onResendOtp}
            resendDisabled={resendCountdown > 0 || isLoading}
            resendCountdown={resendCountdown}
            loading={isLoading}
          />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={goBack}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <p className="text-center text-sm text-slate-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link to="/Register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      )}
    </AuthCard>
  );
};

export default Login;
