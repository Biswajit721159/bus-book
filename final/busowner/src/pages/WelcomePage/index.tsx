import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROLES } from '../../utils/constants';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How fast do operators receive ticket payment settlements?",
    answer: "Ticket payouts are processed daily (T+1) and deposited directly into your linked commercial bank account with automated GST breakdown and settlement reconciliation sheets.",
  },
  {
    question: "Can I customize 2+1 Sleeper and 2+2 Semi-Sleeper seating layouts?",
    answer: "Yes! Our visual seat map builder allows full customization for single/double sleeper berths, luxury pushback chairs, upper/lower decks, and ladies-reserved allocations.",
  },
  {
    question: "How long does operator registration and verification take?",
    answer: "Operator onboarding is fast and seamless. Once you submit your fleet details and transport permits, our verification team approves your account within 2-4 hours.",
  },
  {
    question: "How do cancellations and passenger refund policies work?",
    answer: "You can configure your own tiered cancellation policy (e.g. 100% refund >12h, 50% >6h). The platform automatically handles refund math, deductions, and passenger notifications.",
  },
  {
    question: "Can I manage multi-stop intermediate station pricing?",
    answer: "Absolutely. You can define intermediate boarding and dropping points along your route with individual distance-based dynamic pricing for every station pair.",
  },
  {
    question: "How does the system prevent double-booking across channels?",
    answer: "Our distributed transactional locking mechanism locks seats atomically in sub-milliseconds during checkout, guaranteeing zero double-booking conflicts.",
  },
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, otherUserinfo } = useSelector((state: RootState) => state.userAuth);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [fleetSize, setFleetSize] = useState<number>(3);
  const [busType, setBusType] = useState<'sleeper' | 'seater'>('sleeper');
  const [selectedSeat, setSelectedSeat] = useState<string>('L3');

  const isSuperAdmin = otherUserinfo?.role === ROLES.SUPER_ADMIN;
  const isAdmin = otherUserinfo?.role === ROLES.ADMIN;

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Dynamic Revenue Math
  const seatMultiplier = busType === 'sleeper' ? 36 : 44;
  const avgFare = busType === 'sleeper' ? 850 : 550;
  const estimatedBookings = Math.round(fleetSize * seatMultiplier * 26 * 0.92);
  const estimatedRevenue = Math.round(estimatedBookings * avgFare).toLocaleString('en-IN');
  const dailyDisbursement = Math.round((estimatedBookings * avgFare) / 30).toLocaleString('en-IN');

  // Interactive Live Seat Map Demo
  const lowerSeats = [
    { id: 'L1', type: 'single', status: 'booked', label: 'L1 (Booked)', passenger: 'P. Sharma' },
    { id: 'L2', type: 'single', status: 'booked', label: 'L2 (Booked)', passenger: 'A. Sen' },
    { id: 'L3', type: 'single', status: 'available', label: 'L3 (Available)', fare: busType === 'sleeper' ? '₹850' : '₹550' },
    { id: 'L4', type: 'single', status: 'female', label: 'L4 (Ladies Only)', fare: busType === 'sleeper' ? '₹850' : '₹550' },
    { id: 'L5', type: 'double', status: 'booked', label: 'L5 (Booked)', passenger: 'R. Roy & Guest' },
    { id: 'L6', type: 'double', status: 'available', label: 'L6 (Available)', fare: busType === 'sleeper' ? '₹1,700' : '₹1,100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Subtle Tech Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.25) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-900">BlueBus</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/70">
                  Fleet Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none">Operator & Dispatch Console</p>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <a href="#console-preview" className="hover:text-blue-600 transition-colors">Command Center</a>
            <a href="#capabilities" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-blue-600 transition-colors">Revenue Calculator</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/Login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer shadow-xs"
                >
                  Operator Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/Register')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>Register Fleet</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/Dashboard')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>Launch Dashboard</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Next-Gen Operating System for Bus Fleets</span>
            <span className="text-slate-300">|</span>
            <span className="text-blue-600 font-bold">500+ Active Operators</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto mb-3">
            Run, Schedule & Monetize Your Bus Fleet <br className="hidden sm:inline" />
            <span className="text-blue-600">With Real-Time Seat Automation</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed mb-6 font-medium">
            {isSuperAdmin
              ? 'Complete system control over fleet compliance, operator verifications, and platform audit logs.'
              : isAdmin
              ? 'Manage bus schedules, live sleeper seating matrices, passenger manifests, and daily bank settlements.'
              : 'Empower your bus fleet with automated bookings, dynamic distance pricing, zero double-bookings, and automated daily payouts.'}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto mb-8">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/Register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>Start Free Fleet Onboarding</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/Login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  Operator Sign In
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/Dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span>Launch Operator Console</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-4xl mx-auto pt-5 border-t border-slate-200/80">
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-center">
              <div className="text-lg sm:text-xl font-black text-slate-900">98.4%</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Fleet Occupancy</div>
              <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">+18% vs Offline</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-center">
              <div className="text-lg sm:text-xl font-black text-slate-900">500+</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Fleet Buses</div>
              <div className="text-[10px] font-semibold text-blue-600 mt-0.5">Across 120+ Cities</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-center">
              <div className="text-lg sm:text-xl font-black text-slate-900">₹4.5 Cr+</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Monthly Payouts</div>
              <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">Direct T+1 Bank Wire</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-center">
              <div className="text-lg sm:text-xl font-black text-slate-900">99.98%</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">System SLA Uptime</div>
              <div className="text-[10px] font-semibold text-teal-600 mt-0.5">24/7 Redundant API</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Fleet Command Center Interactive Preview */}
      <section id="console-preview" className="py-10 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Live Operations Preview
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                Unified Operator Command Suite
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time route telematics, instant sleeper layout mapping, and automated booking manifests.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live System Connected</span>
            </div>
          </div>

          {/* Interactive Mock Window */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 text-white shadow-sm">
            {/* Window Title Bar */}
            <div className="bg-slate-800/90 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">operator.bluebus.in/fleet-console</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Operator ID: <span className="text-slate-200 font-bold">OP-9482-KOL</span>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* Telemetry Stats Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
                    <span>Today's Gross Sales</span>
                    <span className="text-emerald-400 font-bold">+18.4%</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white mt-1">₹1,84,500</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">214 confirmed tickets today</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
                    <span>Active Buses on Road</span>
                    <span className="text-blue-400 font-bold">12 / 14 Active</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white mt-1">12 Running</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">2 buses scheduled for evening departure</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
                    <span>Fleet Rating & Reviews</span>
                    <span className="text-amber-400 font-bold">★ 4.92 / 5.0</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white mt-1">4.92 Stars</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Based on 1,420 genuine passenger reviews</div>
                </div>
              </div>

              {/* Split Workspace: Live Bus Routes (Left) & Interactive Seat Layout Matrix (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Left: Active Route Cards (Col 7) */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                    <span>Live Fleet Dispatch Schedule</span>
                    <span className="text-[10px] text-slate-400">Updated 10s ago</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">Royal Cruiser Volvo 9600</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          AC Sleeper
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        42 / 44 Booked (95%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Kolkata (Babughat) → Siliguri (Tenzing Norgay)</span>
                      <span className="font-mono text-slate-400">Dep: 20:30 IST</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">IntrCity SmartBus Multi-Axle</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Luxury 2+1
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        36 / 36 Full (100%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Bangalore (Majestic) → Goa (Panaji Central)</span>
                      <span className="font-mono text-slate-400">Dep: 21:15 IST</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">Himalayan Express Multi-Axle</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          Semi-Sleeper
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        38 / 40 Booked (95%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Delhi (Kashmere Gate) → Manali (Private Bus Stand)</span>
                      <span className="font-mono text-slate-400">Dep: 19:00 IST</span>
                    </div>
                  </div>
                </div>

                {/* Right: Interactive Seat Layout Matrix Demo (Col 5) */}
                <div className="lg:col-span-5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
                      <div>
                        <div className="text-xs font-bold text-white">Live Seat Layout Engine</div>
                        <div className="text-[10px] text-slate-400">Lower Deck Sleeper (2+1 Layout)</div>
                      </div>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">
                        Interactive Demo
                      </span>
                    </div>

                    {/* Seat Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {lowerSeats.map((seat) => {
                        const isSelected = selectedSeat === seat.id;
                        let badgeColor = 'bg-slate-700 text-slate-300 border-slate-600 hover:border-blue-400';
                        if (seat.status === 'booked') badgeColor = 'bg-slate-800 text-slate-500 border-slate-700';
                        if (seat.status === 'female') badgeColor = 'bg-rose-950/60 text-rose-300 border-rose-700/60 hover:border-rose-400';
                        if (seat.status === 'available') badgeColor = 'bg-emerald-950/50 text-emerald-300 border-emerald-600/60 hover:border-emerald-400';
                        if (isSelected) badgeColor += ' ring-2 ring-blue-400';

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            onClick={() => setSelectedSeat(seat.id)}
                            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${badgeColor}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">{seat.id}</span>
                              <span className="text-[9px] uppercase font-semibold">
                                {seat.status === 'booked' ? 'Sold' : seat.status === 'female' ? 'Ladies' : 'Open'}
                              </span>
                            </div>
                            <div className="text-[9px] truncate text-slate-400 mt-1">
                              {seat.status === 'booked' ? seat.passenger : seat.fare}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2.5 border-t border-slate-700">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Ladies Only</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-600" />
                        <span>Confirmed</span>
                      </div>
                    </div>
                  </div>

                  {/* Active selected seat inspector */}
                  <div className="mt-3 p-2 bg-slate-900/90 rounded-lg border border-slate-700/70 text-[10px] flex items-center justify-between">
                    <span>Inspecting: <strong className="text-white">{selectedSeat}</strong></span>
                    <span className="text-blue-300">Click any berth to view status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Platform Capabilities Grid */}
      <section id="capabilities" className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Operator Capabilities
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Built for High-Frequency Transport Operations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Everything your fleet operations need to scale intercity routes, maximize seat yields, and eliminate manual logbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              icon: (
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: 'Multi-Station Route Builder',
              desc: 'Define custom intermediate stops, arrival timetables, and distance-based station pair fares with live pricing updates.',
            },
            {
              icon: (
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              ),
              title: 'Visual Seat Map Engine',
              desc: 'Configure 2+1 Luxury Sleepers, Upper/Lower berths, and 2+2 Executive pushback chairs with atomic lock protection.',
            },
            {
              icon: (
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Automated Daily Payouts',
              desc: 'Direct T+1 bank transfers into your commercial account with automated tax invoices, transparent commission, and GST sheets.',
            },
            {
              icon: (
                <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: 'Driver & Passenger Manifests',
              desc: 'Maintain licensed driver profiles, assign primary/backup drivers per trip, and generate printable digital manifests.',
            },
            {
              icon: (
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ),
              title: 'Verified Rating Analytics',
              desc: 'Monitor post-journey passenger feedback, respond to ratings, and build brand loyalty as a verified premier operator.',
            },
            {
              icon: (
                <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: 'Zero Double-Booking Lock',
              desc: 'High-speed distributed locking guarantees seat availability is synchronized in real-time with sub-millisecond precision.',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-blue-50 transition-all border border-slate-200/80">
                {card.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                {card.title}
              </h3>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Revenue & ROI Estimator */}
      <section id="calculator" className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Revenue Estimator
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
              Estimate Your Fleet's Monthly Yield
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              See projected ticket bookings, gross earnings, and direct daily bank disbursements.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
            <div className="space-y-4">
              {/* Bus Type Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">Select Seating Model:</span>
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBusType('sleeper')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                      busType === 'sleeper'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    AC Luxury Sleeper (2+1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusType('seater')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                      busType === 'seater'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Express Semi-Sleeper (2+2)
                  </button>
                </div>
              </div>

              {/* Fleet Size Chips */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="fleet-slider" className="text-xs font-bold text-slate-900">
                    Fleet Size (Number of Active Buses):
                  </label>
                  <span className="text-xs font-black text-blue-700 bg-white px-2.5 py-0.5 rounded border border-blue-200">
                    {fleetSize} {fleetSize === 1 ? 'Bus' : 'Buses'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 3, 5, 10, 20].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFleetSize(size)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        fleetSize === size
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size} {size === 1 ? 'Bus' : 'Buses'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Monthly Bookings
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {estimatedBookings.toLocaleString('en-IN')} Seats
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 mt-0.5 block">
                    ✓ ~92% Average Occupancy
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Monthly Gross Revenue
                  </span>
                  <div className="text-xl font-black text-blue-700 mt-1">
                    ₹{estimatedRevenue}
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 mt-0.5 block">
                    ✓ T+1 Automated Transfers
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Est. Daily Disbursement
                  </span>
                  <div className="text-xl font-black text-emerald-600 mt-1">
                    ₹{dailyDisbursement} / day
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5 block">
                    ✓ Direct NEFT / RTGS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works (3 Steps) */}
      <section id="how-it-works" className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Simple Onboarding
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Launch Your Fleet in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Register Fleet Account',
              desc: 'Submit your operator credentials and vehicle transport permits in under 3 minutes.',
            },
            {
              step: '02',
              title: 'Configure Routes & Seat Maps',
              desc: 'Define your bus types, assign sleeper berths, set departure timetables, and apply fares.',
            },
            {
              step: '03',
              title: 'Go Live & Receive Daily Wire',
              desc: 'Buses appear live on BlueBus passenger search queries with automatic daily settlements.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 text-center">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-3 shadow-xs">
                {item.step}
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Operator FAQ */}
      <section id="faq" className="py-12 bg-white border-t border-slate-200 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Helpdesk & Support
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-900 pr-3">{faq.question}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-blue-600 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-center relative overflow-hidden shadow-sm">
          <div className="max-w-xl mx-auto relative z-10">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mb-2">
              Scale Your Bus Fleet Business Today
            </h2>
            <p className="text-xs text-blue-100 mb-5 max-w-md mx-auto font-medium">
              Join 500+ bus fleet operators growing their bookings with automated schedules, zero downtime, and daily bank payouts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/Register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-white text-blue-900 font-black text-xs hover:bg-slate-50 transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Register Fleet Account</span>
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => navigate('/Login')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer whitespace-nowrap"
              >
                Operator Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              BB
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs">BlueBus Operator Suite</span>
              <p className="text-[10px] text-slate-400">Fleet Operations & Booking Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-600 font-semibold">
            <a href="#console-preview" className="hover:text-blue-600 transition-colors">Command Center</a>
            <a href="#capabilities" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-blue-600 transition-colors">Revenue Calculator</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            <button type="button" onClick={() => navigate('/Login')} className="hover:text-blue-600 transition-colors">
              Sign In
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} BlueBus Network Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
