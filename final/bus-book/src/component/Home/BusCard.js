import React from "react";
import { Link } from "react-router-dom";

const BusCard = ({ item, date, onShowSeat, busState }) => {
	const isActive = busState.bus__id === item.busId;
	const price = item.totalDistance * 5;
	const isLoading = isActive && busState.disabled_showseat;
	const hasResult = isActive && busState.seat_res_come;
	const seatsLeft = busState.Available_seat;

	return (
		<div className="bg-white rounded-2xl border border-surface-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
			{/* Top accent bar */}
			<div className="h-1 bg-gradient-to-r from-primary-500 to-primary-400" />

			<div className="p-5">
				{/* Header row */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
								<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
							</svg>
						</div>
						<div>
							<h3 className="font-bold text-surface-900 text-base leading-tight">
								{item.busName}
							</h3>
							<span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
								<span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
								Available
							</span>
						</div>
					</div>
					<div className="text-right">
						<p className="text-2xl font-bold text-surface-900">₹{price}</p>
						<p className="text-xs text-surface-400">per seat</p>
					</div>
				</div>

				{/* Route timeline */}
				<div className="flex items-center gap-2 mb-4 bg-surface-50 rounded-xl px-4 py-3">
					{/* Departure */}
					<div className="flex-1 min-w-0">
						<p className="text-lg font-bold text-surface-900 truncate">
							{item.arrivalTime}
						</p>
						<p className="text-xs font-medium text-primary-600 truncate">{item.sourceStationName}</p>
					</div>

					{/* Duration line */}
					<div className="flex flex-col items-center flex-shrink-0 px-2">
						<span className="text-xs text-surface-400 font-medium mb-1">{item.totalTime}</span>
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 rounded-full border-2 border-primary-400 bg-white" />
							<div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-primary-400 to-primary-300 relative">
								<svg
									className="absolute -right-1 -top-1.5 w-3 h-3 text-primary-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="w-2 h-2 rounded-full bg-primary-500" />
						</div>
						<span className="text-xs text-surface-400 mt-1">{item.totalDistance} km</span>
					</div>

					{/* Arrival */}
					<div className="flex-1 min-w-0 text-right">
						<p className="text-lg font-bold text-surface-900 truncate">{item.end_arrive_time}</p>
						<p className="text-xs font-medium text-primary-600 truncate">{item.destinationStationName}</p>
					</div>
				</div>

				{/* Stats row */}
				<div className="flex items-center gap-3 mb-4">
					<div className="flex items-center gap-1.5 text-xs text-surface-500">
						<svg
							className="w-3.5 h-3.5 text-surface-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
							/>
						</svg>
						{item.totalDistance} km
					</div>
					<div className="w-1 h-1 rounded-full bg-surface-300" />
					<div className="flex items-center gap-1.5 text-xs text-surface-500">
						<svg
							className="w-3.5 h-3.5 text-surface-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{item.totalTime}
					</div>
					{hasResult && (
						<>
							<div className="w-1 h-1 rounded-full bg-surface-300" />
							<div
								className={`flex items-center gap-1.5 text-xs font-medium ${seatsLeft > 0 ? "text-green-600" : "text-red-500"}`}
							>
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								{seatsLeft > 0 ? `${seatsLeft} seats left` : "Sold out"}
							</div>
						</>
					)}
				</div>

				{/* Action row */}
				<div className="flex items-center gap-2 pt-3 border-t border-surface-100">
					<Link to={`/view-bus/${item.busId}`} className="flex-shrink-0">
						<button className="btn-secondary btn-sm gap-1.5">
							<svg
								className="w-3.5 h-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Details
						</button>
					</Link>

					<div className="flex-1 flex items-center justify-end gap-2">
						{!isActive || (!isLoading && !hasResult) ? (
							<button
								onClick={() => onShowSeat(item.busId, item.sourceStationName, item.destinationStationName)}
								className="btn-primary btn-sm gap-1.5"
							>
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								Check Seats
							</button>
						) : isLoading ? (
							<button
								disabled
								className="btn-primary btn-sm opacity-70 cursor-not-allowed gap-1.5"
							>
								<div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Checking...
							</button>
						) : hasResult && seatsLeft > 0 ? (
							<Link to={`/book-ticket/${item.busId}/${item.sourceStationName}/${item.destinationStationName}/${date}`}>
								<button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors duration-150 shadow-sm">
									<svg
										className="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Book Now
								</button>
							</Link>
						) : (
							<button
								onClick={() => onShowSeat(item.busId, item.sourceStationName, item.destinationStationName)}
								className="btn-secondary btn-sm gap-1.5"
							>
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								Retry
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusCard;
