import React from 'react';
import { logo } from '../../utils/helpers';

interface AuthCardProps {
  title: string;
  subtitle: string | React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * Shared glassmorphism auth card used across Login, Register,
 * ForgotPassword, and ResetPassword pages.
 */
export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 relative overflow-hidden flex items-center justify-center px-4 py-12">
    {/* Ambient blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-200/40 blur-[130px] pointer-events-none" />
    <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-200/40 blur-[150px] pointer-events-none" />

    <div className={`w-full ${maxWidth} animate-fade-in relative z-10`}>
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-200/60">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-md flex items-center justify-center p-2">
              <img src={logo} alt="BusOwner logo" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <div className="text-sm text-slate-500 mt-2">{subtitle}</div>
        </div>

        {children}
      </div>
    </div>
  </div>
);

export default AuthCard;
