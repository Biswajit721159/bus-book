import React from "react";
import { Link } from "react-router-dom";
import useResponsiveAppBar from "./useResponsiveAppBar";
import NavLink from "./NavLink";

export const ResponsiveAppBar = () => {
	const {
		user,
		mobileOpen,
		profileOpen,
		profileRef,
		initials,
		firstName,
		handleLogout,
		closeMobile,
		toggleMobile,
		toggleProfile,
		setProfileOpen,
	} = useResponsiveAppBar();

	return (
		<nav className="bg-primary-700 shadow-lg sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
						<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
							<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
							</svg>
						</div>
						<span className="text-white font-bold text-lg tracking-tight">BlueBus</span>
					</Link>

					{/* Desktop Nav */}
					<div className="hidden md:flex items-center gap-1">
						<NavLink to="/">Home</NavLink>
						<NavLink to="/book-bus">Book Bus</NavLink>
						<NavLink to="/check-status">Check Status</NavLink>
						{user?.user && (
							<>
								<NavLink to="/my-bookings">My Bookings</NavLink>
								<NavLink to="/master-list">Passengers</NavLink>
							</>
						)}
						{/* <a
							href={process.env.REACT_APP_BUS_OWNER_URL || "http://localhost:3001"}
							target="_blank"
							rel="noopener noreferrer"
							className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 text-white/80 hover:text-white hover:bg-white/10"
						>
							Bus Owner
						</a> */}
					</div>

					{/* Right side */}
					<div className="hidden md:flex items-center gap-3">
						{user?.user ? (
							<div className="relative" ref={profileRef}>
								<button
									onClick={toggleProfile}
									className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-150"
								>
									<div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-bold">
										{initials}
									</div>
									<span className="text-white text-sm font-medium max-w-[120px] truncate">
										{firstName}
									</span>
									<svg
										className={`w-4 h-4 text-white/70 transition-transform duration-150 ${
											profileOpen ? "rotate-180" : ""
										}`}
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{profileOpen && (
									<div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-modal border border-surface-100 py-1 animate-slide-up">
										<div className="px-4 py-3 border-b border-surface-100">
											<p className="text-sm font-semibold text-surface-900 truncate">
												{user.user?.name}
											</p>
											<p className="text-xs text-surface-500 truncate">
												{user.user?.email}
											</p>
										</div>
										<Link
											to="/my-bookings"
											onClick={() => setProfileOpen(false)}
											className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
										>
											<svg
												className="w-4 h-4 text-surface-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
												/>
											</svg>
											My Bookings
										</Link>
										<Link
											to="/master-list"
											onClick={() => setProfileOpen(false)}
											className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
										>
											<svg
												className="w-4 h-4 text-surface-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											Passengers
										</Link>
										<div className="border-t border-surface-100 mt-1 pt-1">
											<button
												onClick={handleLogout}
												className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
												Sign Out
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Link
									to="/login"
									className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-150"
								>
									Sign In
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 text-sm font-medium bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-colors duration-150"
								>
									Sign Up
								</Link>
							</div>
						)}
					</div>

					{/* Mobile hamburger */}
					<button
						onClick={toggleMobile}
						className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
						aria-label="Toggle menu"
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

			{/* Mobile menu */}
			{mobileOpen && (
				<div className="md:hidden bg-primary-800 border-t border-white/10 animate-fade-in">
					<div className="px-4 py-3 space-y-1">
						<NavLink to="/" onClick={closeMobile}>
							Home
						</NavLink>
						<NavLink to="/book-bus" onClick={closeMobile}>
							Book Bus
						</NavLink>
						<NavLink to="/check-status" onClick={closeMobile}>
							Check Status
						</NavLink>
						{user?.user && (
							<>
								<NavLink to="/my-bookings" onClick={closeMobile}>
									My Bookings
								</NavLink>
								<NavLink to="/master-list" onClick={closeMobile}>
									Passengers
								</NavLink>
							</>
						)}
						<a
							href={process.env.REACT_APP_BUS_OWNER_URL || "http://localhost:3001"}
							target="_blank"
							rel="noopener noreferrer"
							onClick={closeMobile}
							className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 text-white/80 hover:text-white hover:bg-white/10"
						>
							Bus Owner
						</a>
					</div>
					<div className="px-4 py-3 border-t border-white/10">
						{user?.user ? (
							<div className="space-y-2">
								<div className="flex items-center gap-3 px-3 py-2">
									<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
										{initials}
									</div>
									<div>
										<p className="text-white text-sm font-medium">
											{user.user.user?.name}
										</p>
										<p className="text-white/60 text-xs">{user.user.user?.email}</p>
									</div>
								</div>
								<button
									onClick={() => {
										handleLogout();
										closeMobile();
									}}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-white/5 rounded-lg transition-colors"
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
									Sign Out
								</button>
							</div>
						) : (
							<div className="flex gap-2">
								<Link
									to="/login"
									onClick={closeMobile}
									className="flex-1 text-center px-4 py-2 text-sm font-medium text-white/90 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
								>
									Sign In
								</Link>
								<Link
									to="/register"
									onClick={closeMobile}
									className="flex-1 text-center px-4 py-2 text-sm font-medium bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
								>
									Sign Up
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default ResponsiveAppBar;
