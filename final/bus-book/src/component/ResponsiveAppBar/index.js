import React from "react";
import { Link, useLocation } from "react-router-dom";
import useResponsiveAppBar from "./useResponsiveAppBar";
import NavLink from "./NavLink";

// SVG Icon Helpers
const HomeIcon = ({ className }) => (
	<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		/>
	</svg>
);

const BusIcon = ({ className }) => (
	<svg className={className} fill="currentColor" viewBox="0 0 24 24">
		<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
	</svg>
);

const SearchTicketIcon = ({ className }) => (
	<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
);

const BookingIcon = ({ className }) => (
	<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
		/>
	</svg>
);

const PassengersIcon = ({ className }) => (
	<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
		/>
	</svg>
);

export const ResponsiveAppBar = () => {
	const {
		user,
		mobileOpen,
		profileOpen,
		profileRef,
		initials,
		firstName,
		userEmail,
		scrolled,
		handleLogout,
		closeMobile,
		toggleMobile,
		toggleProfile,
		setProfileOpen,
	} = useResponsiveAppBar();

	const location = useLocation();
	const isLoggedIn = Boolean(user?.user || user?.email);

	return (
		<header
			className={`sticky top-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-blue-700/95 backdrop-blur-md shadow-lg border-b border-blue-600/50"
					: "bg-blue-700 border-b border-blue-600/40 shadow-md"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Brand / Logo */}
					<Link
						to="/"
						className="flex items-center gap-2.5 group flex-shrink-0 focus:outline-none"
					>
						<div className="w-9 h-9 rounded-xl bg-white text-blue-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
							<BusIcon className="w-5 h-5" />
						</div>
						<div className="flex flex-col">
							<div className="flex items-center gap-1.5">
								<span className="text-white font-black text-lg tracking-tight">
									BlueBus
								</span>
								<span className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse"></span>
							</div>
							<span className="text-[9px] text-blue-100 font-semibold tracking-wider uppercase -mt-0.5 hidden sm:block">
								Fast & Easy Booking
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-1 xl:gap-2">
						<NavLink to="/" icon={HomeIcon}>
							Home
						</NavLink>
						<NavLink to="/book-bus" icon={BusIcon}>
							Book Bus
						</NavLink>
						<NavLink to="/check-status" icon={SearchTicketIcon}>
							Check Status
						</NavLink>

						{isLoggedIn && (
							<>
								<NavLink to="/my-bookings" icon={BookingIcon}>
									My Bookings
								</NavLink>
								<NavLink to="/master-list" icon={PassengersIcon}>
									Passengers
								</NavLink>
							</>
						)}
					</nav>

					{/* Right Side: Profile / Auth Actions */}
					<div className="hidden lg:flex items-center gap-3">
						{isLoggedIn ? (
							<div className="relative" ref={profileRef}>
								<button
									onClick={toggleProfile}
									className={`flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full transition-all duration-200 focus:outline-none ${
										profileOpen
											? "bg-white/25 ring-2 ring-white/60 shadow-inner"
											: "bg-white/15 hover:bg-white/25 border border-white/25"
									}`}
									aria-expanded={profileOpen}
									aria-label="User profile menu"
								>
									<div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center text-xs font-bold shadow-sm">
										{initials}
									</div>
									<div className="flex flex-col text-left">
										<span className="text-white text-xs font-semibold max-w-[100px] truncate leading-tight">
											{firstName}
										</span>
										<span className="text-[10px] text-blue-100 leading-none">
											Account
										</span>
									</div>
									<svg
										className={`w-3.5 h-3.5 text-blue-100 transition-transform duration-200 ${
											profileOpen ? "rotate-180 text-white" : ""
										}`}
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2.5}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{/* Profile Dropdown Menu - Clean Elevated White Card */}
								{profileOpen && (
									<div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-slide-up z-50 divide-y divide-slate-100">
										{/* User Info Header */}
										<div className="px-4 py-3 bg-blue-50/50 rounded-t-2xl">
											<p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
												Signed in as
											</p>
											<p className="text-sm font-bold text-slate-900 truncate mt-0.5">
												{user?.user?.name || user?.name || "Passenger"}
											</p>
											{userEmail && (
												<p className="text-xs text-slate-500 truncate mt-0.5">
													{userEmail}
												</p>
											)}
										</div>

										{/* Navigation Links */}
										<div className="py-1.5">
											<Link
												to="/my-bookings"
												onClick={() => setProfileOpen(false)}
												className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
											>
												<BookingIcon className="w-4 h-4 text-blue-500" />
												<span>My Bookings</span>
											</Link>
											<Link
												to="/master-list"
												onClick={() => setProfileOpen(false)}
												className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
											>
												<PassengersIcon className="w-4 h-4 text-emerald-500" />
												<span>Passenger List</span>
											</Link>
										</div>

										{/* Sign Out */}
										<div className="pt-1.5">
											<button
												onClick={handleLogout}
												className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left"
											>
												<svg
													className="w-4 h-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
													/>
												</svg>
												<span>Sign Out</span>
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center gap-2.5">
								<Link
									to="/login"
									className="px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 border border-white/30 rounded-xl transition-all duration-150"
								>
									Sign In
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 text-xs font-bold bg-white text-blue-700 hover:bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 hover:scale-[1.02]"
								>
									Sign Up
								</Link>
							</div>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="flex items-center gap-2 lg:hidden">
						{isLoggedIn && (
							<div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center text-xs font-bold shadow-sm">
								{initials}
							</div>
						)}
						<button
							onClick={toggleMobile}
							className="p-2.5 rounded-xl text-white hover:bg-white/15 bg-white/10 border border-white/20 transition-colors focus:outline-none"
							aria-label="Toggle navigation menu"
						>
							{mobileOpen ? (
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Sliding Drawer / Menu */}
			{mobileOpen && (
				<div className="lg:hidden bg-blue-800 border-t border-blue-600/40 animate-fade-in divide-y divide-blue-700">
					{/* Navigation Links */}
					<div className="px-4 py-4 space-y-1.5">
						<Link
							to="/"
							onClick={closeMobile}
							className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
								location.pathname === "/"
									? "bg-white/20 text-white font-semibold"
									: "text-blue-100 hover:text-white hover:bg-white/10"
							}`}
						>
							<HomeIcon className="w-5 h-5 text-blue-200" />
							<span>Home</span>
						</Link>
						<Link
							to="/book-bus"
							onClick={closeMobile}
							className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
								location.pathname === "/book-bus"
									? "bg-white/20 text-white font-semibold"
									: "text-blue-100 hover:text-white hover:bg-white/10"
							}`}
						>
							<BusIcon className="w-5 h-5 text-blue-200" />
							<span>Book Bus</span>
						</Link>
						<Link
							to="/check-status"
							onClick={closeMobile}
							className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
								location.pathname === "/check-status"
									? "bg-white/20 text-white font-semibold"
									: "text-blue-100 hover:text-white hover:bg-white/10"
							}`}
						>
							<SearchTicketIcon className="w-5 h-5 text-blue-200" />
							<span>Check Status</span>
						</Link>

						{isLoggedIn && (
							<>
								<Link
									to="/my-bookings"
									onClick={closeMobile}
									className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
										location.pathname === "/my-bookings"
											? "bg-white/20 text-white font-semibold"
											: "text-blue-100 hover:text-white hover:bg-white/10"
									}`}
								>
									<BookingIcon className="w-5 h-5 text-blue-200" />
									<span>My Bookings</span>
								</Link>
								<Link
									to="/master-list"
									onClick={closeMobile}
									className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
										location.pathname === "/master-list"
											? "bg-white/20 text-white font-semibold"
											: "text-blue-100 hover:text-white hover:bg-white/10"
									}`}
								>
									<PassengersIcon className="w-5 h-5 text-blue-200" />
									<span>Passengers List</span>
								</Link>
							</>
						)}
					</div>

					{/* Mobile User Section */}
					<div className="px-4 py-4">
						{isLoggedIn ? (
							<div className="space-y-3">
								<div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
									<div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center text-sm font-bold shadow-sm">
										{initials}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white text-sm font-semibold truncate">
											{user?.user?.name || user?.name || "Passenger"}
										</p>
										<p className="text-blue-100 text-xs truncate">
											{userEmail || "Logged in"}
										</p>
									</div>
								</div>
								<button
									onClick={handleLogout}
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-100 hover:text-white bg-rose-500/30 hover:bg-rose-500/50 border border-rose-400/40 rounded-xl transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
									<span>Sign Out</span>
								</button>
							</div>
						) : (
							<div className="grid grid-cols-2 gap-3">
								<Link
									to="/login"
									onClick={closeMobile}
									className="flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-colors text-center"
								>
									Sign In
								</Link>
								<Link
									to="/register"
									onClick={closeMobile}
									className="flex items-center justify-center px-4 py-2.5 text-xs font-bold bg-white text-blue-600 hover:bg-blue-50 rounded-xl shadow-md transition-colors text-center"
								>
									Sign Up
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	);
};

export default ResponsiveAppBar;
