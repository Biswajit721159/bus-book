import React, { useState } from "react";
import { getFormattedDate } from "../../utilities/date";

const JourneySummary = ({ data }) => {
	const [copiedPnr, setCopiedPnr] = useState(false);
	if (!data) return null;

	const bookingId = data.id || data._id;
	const pnrNumber = data.pnrNumber || data.pnr_number;
	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const hasPassed = data.bookingDate ? new Date(data.bookingDate) < todayStart : false;

	const handleCopyPnr = () => {
		if (navigator.clipboard && (pnrNumber || bookingId)) {
			navigator.clipboard.writeText(String(pnrNumber || `#${bookingId}`));
			setCopiedPnr(true);
			setTimeout(() => setCopiedPnr(false), 2000);
		}
	};


	const sourceName = data?.sourceStation?.stationName || "Source Station";
	const destName =
		data?.distStation?.stationName || data?.destinationStation?.stationName || "Destination Station";
	const busName = data?.bus?.busName || "Standard Bus";

	return (
		<div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden mb-6 transition-all">
			{/* Top Header Strip */}
			<div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/10">
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7h8m-8 4h8m-8 4h5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
							/>
						</svg>
					</div>
					<div>
						<p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Bus Operator</p>
						<h2 className="text-lg font-bold text-white tracking-tight">{busName}</h2>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{data.status === "CONFIRMED" ? (
						hasPassed ? (
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-100 border border-blue-400/30 backdrop-blur-sm">
								<span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse"></span>
								Completed Journey
							</span>
						) : (
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
								Confirmed Booking
							</span>
						)
					) : data.status === "CANCELLED" ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-400/30 backdrop-blur-sm">
							<span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
							Cancelled
						</span>
					) : (
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
							{data.status}
						</span>
					)}
				</div>
			</div>

			{/* Route Visualizer Section */}
			<div className="px-6 py-6 border-b border-surface-100 bg-surface-50/40">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
					{/* Departure */}
					<div className="flex items-center gap-3.5">
						<div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<div>
							<p className="text-xs font-medium text-surface-500 uppercase tracking-wider">From (Origin)</p>
							<p className="text-base font-bold text-surface-900">{sourceName}</p>
						</div>
					</div>

					{/* Center Indicator */}
					<div className="flex-1 flex flex-col items-center justify-center px-4 w-full sm:w-auto">
						<div className="flex items-center gap-2 text-xs font-medium text-surface-500 mb-1">
							<svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
								/>
							</svg>
							<span>{data?.totalDistance || 0} km direct</span>
						</div>
						<div className="relative w-full max-w-[200px] flex items-center">
							<div className="h-[2px] w-full bg-gradient-to-r from-emerald-400 via-blue-500 to-rose-400 rounded-full"></div>
							<div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-white"></div>
						</div>
					</div>

					{/* Arrival */}
					<div className="flex items-center gap-3.5">
						<div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
								/>
							</svg>
						</div>
						<div>
							<p className="text-xs font-medium text-surface-500 uppercase tracking-wider">To (Destination)</p>
							<p className="text-base font-bold text-surface-900">{destName}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Info Grid Tiles */}
			<div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-white">
				<div className="bg-blue-50/90 p-3.5 rounded-xl border border-blue-200/90 flex flex-col justify-between">
					<p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
						<svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
						</svg>
						PNR Number
					</p>
					<button
						onClick={handleCopyPnr}
						className="inline-flex items-center gap-1.5 text-sm font-extrabold font-mono text-blue-800 hover:text-blue-950 transition-colors group cursor-pointer"
						title="Click to copy PNR"
					>
						<span className="tracking-wider">{pnrNumber || `#${bookingId}`}</span>
						<svg
							className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-700 transition-colors"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						{copiedPnr && <span className="text-[10px] text-emerald-600 font-sans font-semibold">Copied!</span>}
					</button>
				</div>

				<div className="bg-surface-50/80 p-3.5 rounded-xl border border-surface-100">
					<p className="text-xs text-surface-500 font-medium mb-1 flex items-center gap-1">
						<svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						Travel Date
					</p>
					<p className="text-sm font-bold text-surface-900">{getFormattedDate(data?.bookingDate)}</p>
				</div>

				<div className="bg-surface-50/80 p-3.5 rounded-xl border border-surface-100">
					<p className="text-xs text-surface-500 font-medium mb-1 flex items-center gap-1">
						<svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Booking Date
					</p>
					<p className="text-sm font-bold text-surface-900">
						{getFormattedDate(data?.bookedAt || data?.bookingDate)}
					</p>
				</div>

				<div className="bg-surface-50/80 p-3.5 rounded-xl border border-surface-100">
					<p className="text-xs text-surface-500 font-medium mb-1 flex items-center gap-1">
						<svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
							/>
						</svg>
						Distance
					</p>
					<p className="text-sm font-bold text-surface-900">{data?.totalDistance || 0} km</p>
				</div>

				<div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
					<p className="text-xs text-emerald-700 font-medium mb-1 flex items-center gap-1">
						<svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						Total Amount
					</p>
					<p className="text-base font-extrabold text-emerald-700">
						₹{data?.totalAmount || data?.totalRupees || 0}
					</p>
				</div>
			</div>

		</div>
	);
};

export default JourneySummary;

