import React from "react";
import { getFormattedDate } from "../../utilities/date";

const JourneySummary = ({ data, onCopyId }) => {
	if (!data) return null;

	const bookingId = data.id || data._id;
	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const hasPassed = data.bookingDate ? new Date(data.bookingDate) < todayStart : false;

	return (
		<div className="card p-6 mb-6">
			{/* Top Grid: Bus Name, Route, Booking Status */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				<div>
					<p className="text-xs text-surface-500 mb-1">Bus Name</p>
					<p className="text-sm font-semibold text-surface-900">{data?.bus?.busName}</p>
				</div>
				<div>
					<p className="text-xs text-surface-500 mb-1">Route</p>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
							<span className="text-sm font-semibold text-surface-800">
								{data?.sourceStation?.stationName}
							</span>
						</div>
						<svg
							className="w-4 h-4 text-surface-400 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
						<div className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
							<span className="text-sm font-semibold text-surface-800">
								{data?.distStation?.stationName || data?.destinationStation?.stationName}
							</span>
						</div>
					</div>
				</div>
				<div>
					<p className="text-xs text-surface-500 mb-1">Status</p>
					<div className="flex items-center mt-0.5">
						{data.status === "CONFIRMED" ? (
							hasPassed ? (
								<span className="badge bg-blue-500 text-white border border-blue-100 px-2.5 py-0.5 rounded text-xs font-medium">
									Completed
								</span>
							) : (
								<span className="badge bg-green-500 text-white border border-green-100 px-2.5 py-0.5 rounded text-xs font-medium">
									Confirmed
								</span>
							)
						) : data.status === "CANCELLED" ? (
							<span className="badge bg-red-500 text-white border border-red-100 px-2.5 py-0.5 rounded text-xs font-medium">
								Cancelled
							</span>
						) : (
							<span className="badge bg-surface-100 text-surface-700 border border-surface-200 px-2.5 py-0.5 rounded text-xs font-medium">
								{data.status}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Divider and Bottom Grid: Travel Date, Booking Date, Distance, Amount, Booking ID */}
			<div className="mt-4 pt-4 border-t border-surface-100 grid grid-cols-2 sm:grid-cols-5 gap-4">
				<div>
					<p className="text-xs text-surface-500 mb-1">Travel Date</p>
					<p className="text-sm font-semibold text-surface-900">
						{getFormattedDate(data?.bookingDate)}
					</p>
				</div>
				<div>
					<p className="text-xs text-surface-500 mb-1">Booking Date</p>
					<p className="text-sm font-semibold text-surface-900">
						{getFormattedDate(data?.bookedAt || data?.bookingDate)}
					</p>
				</div>
				<div>
					<p className="text-xs text-surface-500 mb-1">Distance</p>
					<p className="text-sm font-semibold text-surface-900">{data?.totalDistance} km</p>
				</div>
				<div>
					<p className="text-xs text-surface-500 mb-1">Total Amount</p>
					<p className="text-sm font-semibold text-green-700">
						₹{data?.totalAmount || data?.totalRupees}
					</p>
				</div>
				<div>
					<p className="text-xs text-surface-500 mb-1">Booking ID</p>
					<div className="flex">
						<button
							onClick={() => onCopyId(bookingId)}
							className="text-sm text-primary-600 hover:text-primary-700 font-semibold font-mono flex items-center gap-1 group"
							title="Click to copy Booking ID"
						>
							<span className="truncate max-w-[120px]">{bookingId}</span>
							<svg
								className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JourneySummary;
