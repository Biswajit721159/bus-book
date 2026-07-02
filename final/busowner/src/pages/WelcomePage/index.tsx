import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logo } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, otherUserinfo } = useSelector((state: RootState) => state.userAuth);

  const isSuperAdmin = otherUserinfo?.role === ROLES.SUPER_ADMIN;
  const isAdmin = otherUserinfo?.role === ROLES.ADMIN;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Decorative blurred background shapes (Light Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-primary-200/60 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-200/60 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-violet-200/50 blur-[130px] pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto animate-fade-in">
          {/* Logo container with hover glow */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 flex items-center justify-center p-3 hover:border-primary-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300">
              <img src={logo} alt="Bus Manager" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>

          {/* Heading with text gradient */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 tracking-tight leading-none mb-6 drop-shadow-sm">
            {user ? `Welcome back, ${user.user?.fullName?.split(' ')[0]}` : 'Bus Schedule Manager'}
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto">
            {isSuperAdmin
              ? 'Manage bus approvals, bookings, and users from your super admin dashboard.'
              : isAdmin
              ? 'Add and manage your buses, view seat availability, and track schedules.'
              : 'A professional platform for managing bus schedules and bookings efficiently.'}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/Login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l-4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/Register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Create Account
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/Dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Feature Cards Grid (Glassmorphic Light) */}
        {!user && (
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mx-auto px-4 animate-slide-up">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: 'Schedule Management',
                desc: 'Easily add and manage bus routes, timetables, and station orders.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                ),
                title: 'Booking Tracking',
                desc: 'Monitor reservations, seat charts, and ticket payments in real time.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                title: 'User Management',
                desc: 'Verify and authorize bus operators, and oversee system administrators.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-2xl hover:bg-white/80 transition-all duration-300 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 group text-center">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm group-hover:bg-primary-50 group-hover:border-primary-100 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-200/60 bg-white/40 backdrop-blur-sm relative z-10">
        &copy; {new Date().getFullYear()} Bus Schedule Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default WelcomePage;
