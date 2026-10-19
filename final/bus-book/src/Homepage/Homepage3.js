import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-slate-900 text-slate-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
					{/* Brand & Mission */}
					<div className="lg:col-span-1">
						<div className="flex items-center gap-2.5 mb-3">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
								</svg>
							</div>
							<span className="text-white font-black text-lg tracking-tight">BlueBus</span>
						</div>
						<p className="text-xs text-slate-400 leading-relaxed mb-4">
							India&apos;s modern bus booking platform. Fast reservations, live seat selection, verified operators, and instant confirmation.
						</p>
						<div className="flex items-center gap-2">
							<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-emerald-400 border border-slate-700">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
								24/7 Booking Active
							</span>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Quick Links</h4>
						<ul className="space-y-2">
							{[
								{ to: "/", label: "Home" },
								{ to: "/book-bus", label: "Search & Book Buses" },
								{ to: "/check-status", label: "Check Ticket Status" },
								{ to: "/my-bookings", label: "My Bookings" },
								{ to: "/master-list", label: "Passenger Directory" },
							].map((link) => (
								<li key={link.to}>
									<Link
										to={link.to}
										className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
									>
										<svg className="w-2.5 h-2.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
										</svg>
										<span>{link.label}</span>
									</Link>
								</li>
							))}
							<li>
								<a
									href={process.env.REACT_APP_BUS_OWNER_URL || "http://localhost:3001"}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 pt-0.5"
								>
									<svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
										<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
									</svg>
									<span>Bus Owner Portal</span>
									<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</a>
							</li>
						</ul>
					</div>

					{/* Top Hub Destinations */}
					<div>
						<h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Major Hubs</h4>
						<ul className="space-y-2">
							{[
								"Kolkata & Siliguri",
								"Delhi & Manali",
								"Bangalore & Goa",
								"Mumbai & Pune",
								"Hyderabad & Vijayawada",
								"Chennai & Bangalore",
							].map((dest) => (
								<li key={dest} className="text-xs text-slate-400 flex items-center gap-2">
									<svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span>{dest}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Contact & Support */}
					<div>
						<h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Passenger Helpdesk</h4>
						<ul className="space-y-2.5">
							<li className="flex items-start gap-2">
								<svg className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
								<div>
									<p className="text-xs font-bold text-white">1800-123-4567</p>
									<p className="text-[10px] text-slate-400">Toll-free 24/7 Helpline</p>
								</div>
							</li>
							<li className="flex items-start gap-2">
								<svg className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								<div>
									<p className="text-xs font-bold text-white">support@bluebus.in</p>
									<p className="text-[10px] text-slate-400">Response within 2 hours</p>
								</div>
							</li>
							<li className="flex items-start gap-2">
								<svg className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
								<p className="text-xs text-slate-400">100% Secure SSL Payment Gateways</p>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
					<p>© {new Date().getFullYear()} BlueBus Online Services Pvt. Ltd. All rights reserved.</p>
					<div className="flex items-center gap-3">
						<span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
						<span>·</span>
						<span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
						<span>·</span>
						<span className="hover:text-slate-400 cursor-pointer">Security</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
