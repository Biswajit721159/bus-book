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
      ? {
          title: 'Operator Sign In',
          subtitle: 'Welcome back! Access your fleet dashboard and booking manifests.',
        }
      : {
          title: 'Enter Verification Code',
          subtitle: (
            <span>
              We've sent a 6-digit one-time code to{' '}
              <strong className="text-slate-900 font-semibold">{emailForOtp}</strong>
            </span>
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
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Email Sign In</span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>New bus operator or fleet manager? </span>
          <Link
            to="/Register"
            className="text-blue-600 hover:text-blue-700 font-bold transition-colors ml-1"
          >
            Register your fleet ➔
          </Link>
        </div>
      )}
    </AuthCard>
  );
};

export default Login;
