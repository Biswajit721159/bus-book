import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  subtitle: string | React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  badge?: string;
}

/**
 * Modern Split-Screen & Card Auth Layout for Bus Owner / Operator Portal
 */
export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  badge = 'Fleet Partner Portal',
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 lg:p-6 font-sans selection:bg-blue-600 selection:text-white">
      {/* Outer Card Container */}
      <div className="w-full max-w-6xl min-h-screen lg:min-h-[680px] bg-white lg:rounded-3xl lg:border lg:border-slate-200/80 shadow-2xl lg:shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand & Fleet Showcase (Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
                </svg>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block">BlueBus</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300">
                  {badge}
                </span>
              </div>
            </div>
          </div>

          {/* Center Value Proposition */}
          <div className="my-10 relative z-10 hidden sm:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Next-Gen Fleet OS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Maximize Seat Occupancy & Automate Bus Operations
            </h2>

            <ul className="mt-6 space-y-3.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <span>Real-Time Seat Booking & Distributed Inventory Lock</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <span>Direct Daily Automated Commercial Bank Disbursements</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <span>Multi-Station Intermediate Route & Pricing Engine</span>
              </li>
            </ul>

            {/* Operator Quote Card */}
            <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200 leading-relaxed shadow-lg">
              <p className="italic">
                "BlueBus boosted our fleet booking rate by 34% within the first month. Payouts arrive like clockwork every morning."
              </p>
              <div className="mt-2.5 flex items-center gap-2 font-bold text-white">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">
                  ★
                </div>
                <span>Royal Cruiser Travels • 18 Buses</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Metrics */}
          <div className="pt-6 border-t border-white/15 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <div>
              <span className="text-base font-black text-white block">500+</span>
              <span>Active Buses</span>
            </div>
            <div>
              <span className="text-base font-black text-white block">₹45M+</span>
              <span>Monthly Payouts</span>
            </div>
            <div>
              <span className="text-base font-black text-white block">99.9%</span>
              <span>Live Uptime</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative bg-white">
          {/* Form Header */}
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              <div className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">
                {subtitle}
              </div>
            </div>

            {/* Form Slot */}
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
