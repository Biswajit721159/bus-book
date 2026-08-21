import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Logout_User } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { logo } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS_ADMIN: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Add Bus',
    path: '/Buses/AddBus',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    path: '/Bookings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

const NAV_ITEMS_SUPERADMIN: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Manage Users',
    path: '/Dashboard/ManageUsers',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    path: '/Bookings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export const Navbar: React.FC = () => {
  const { user, otherUserinfo } = useSelector((state: RootState) => state.userAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin = otherUserinfo.role === ROLES.ADMIN;
  const navItems = isAdmin ? NAV_ITEMS_ADMIN : NAV_ITEMS_SUPERADMIN;
  const panelLabel = isAdmin ? 'Admin Panel' : 'Super Admin';
  const initials = user?.user?.fullName?.charAt(0)?.toUpperCase() || 'U';

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    dispatch(Logout_User());
    navigate('/Login');
    toast.success('Logged out successfully');
    setDrawerOpen(false);
  };

  if (!user) return null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 py-2.5">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="btn-icon lg:hidden"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => navigate('/Dashboard')}
                className="flex items-center gap-2.5 group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <img src={logo} alt="logo" className="h-5 w-5 rounded object-cover" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-bold text-slate-900">{panelLabel}</span>
                </div>
              </button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Profile pill */}
              <button
                type="button"
                onClick={() => navigate('/Settings')}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-primary-50 hover:border-primary-200 transition-all duration-150 group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-white">{initials}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 max-w-[120px] truncate leading-tight">
                    {user?.user?.fullName}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">{isAdmin ? 'Bus Admin' : 'Super Admin'}</p>
                </div>
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-modal animate-slide-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                  <img src={logo} alt="logo" className="h-5 w-5 object-cover" />
                </div>
                <span className="font-bold text-slate-900">{panelLabel}</span>
              </div>
              <button type="button" onClick={() => setDrawerOpen(false)} className="btn-icon text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Profile */}
            <button
              type="button"
              className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors w-full text-left"
              onClick={() => { navigate('/Settings'); setDrawerOpen(false); }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-sm font-bold text-white">{initials}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{user?.user?.fullName}</p>
                <p className="text-xs text-slate-500">{user?.user?.email}</p>
              </div>
            </button>

            {/* Nav Items */}
            <nav className="px-3 py-3 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl mb-1 transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive(item.path) ? 'text-primary-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3y 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
