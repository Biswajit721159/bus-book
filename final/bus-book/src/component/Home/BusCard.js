import React from "react";
import { Link } from "react-router-dom";
import RatingBadge from "../RatingBadge";

const BusCard = ({ item, date, onShowSeat, busState }) => {
	const isActive = busState.bus__id === item.busId;
	const price = item.totalDistance * 5;
	const isLoading = isActive && busState.disabled_showseat;
	const hasResult = isActive && busState.seat_res_come;
	const seatsLeft = busState.Available_seat;

	const departureTime = item.arrivalTime || "--:--";
	const arrivalTime = item.departureTime || item.end_arrive_time || item.arrivalTime || "--:--";

	return (
		<div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-400 transition-all duration-150 overflow-hidden flex flex-col justify-between">
			{/* Top subtle blue accent */}
			<div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

			<div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
				<div>
					{/* Top Header: Bus Operator & Price */}
					<div className="flex items-start justify-between gap-3 mb-4">
						<div className="flex items-center gap-3 min-w-0 flex-1">
							<div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-150">
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
								</svg>
							</div>

							<div className="min-w-0 flex-1">
								<h3
									className="font-bold text-slate-900 text-base leading-snug truncate group-hover:text-blue-600 transition-colors"
									title={item.busName}
								>
									{item.busName}
								</h3>
								<div className="flex flex-wrap items-center gap-1.5 mt-1.5">
							<RatingBadge rating={item.averageRating} count={item.totalReviewsCount} size="sm" />
							<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
										Available
									</span>
								</div>
							</div>
						</div>

						{/* Fare Price */}
						<div className="text-right flex-shrink-0">
							<div className="flex items-baseline justify-end">
								<span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
									₹{price}
								</span>
							</div>
							<span className="text-[10px] font-medium text-slate-400 block -mt-0.5">
								per seat
							</span>
						</div>
					</div>

					{/* Route & Journey Box */}
					<div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-4 mb-4 transition-colors">
						<div className="flex items-center justify-between gap-2">
							{/* Departure */}
							<div className="min-w-0 flex-1">
								<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
									Departure
								</span>
								<p className="text-lg font-bold text-slate-900 leading-tight">
									{departureTime}
								</p>
								<p
									className="text-xs font-semibold text-blue-600 truncate mt-1"
									title={item.sourceStationName}
								>
									{item.sourceStationName}
								</p>
							</div>

							{/* Journey Route Line & Duration */}
							<div className="flex flex-col items-center flex-shrink-0 px-1 min-w-[95px] sm:min-w-[115px]">
								<span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full mb-1.5 whitespace-nowrap">
									{item.totalTime}
								</span>
								<div className="flex items-center gap-1 w-full justify-center">
									<div className="w-2 h-2 rounded-full border-2 border-blue-500 bg-white flex-shrink-0" />
									<div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 relative min-w-[24px]">
										<svg
											className="absolute -right-1 -top-1.5 w-3 h-3 text-blue-600"
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
									<div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
								</div>
								<span className="text-[10px] font-medium text-slate-400 mt-1 whitespace-nowrap">
									{item.totalDistance} km
								</span>
							</div>

							{/* Arrival */}
							<div className="min-w-0 flex-1 text-right">
								<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
									Arrival
								</span>
								<p className="text-lg font-bold text-slate-900 leading-tight">
									{arrivalTime}
								</p>
								<p
									className="text-xs font-semibold text-blue-600 truncate mt-1"
									title={item.destinationStationName}
								>
									{item.destinationStationName}
								</p>
							</div>
						</div>
					</div>

					{/* Seat Status Banner (when seat count loaded) */}
					{hasResult && (
						<div
							className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold mb-3.5 transition-all ${
								seatsLeft > 0
									? "bg-emerald-50 text-emerald-800 border border-emerald-200"
									: "bg-rose-50 text-rose-800 border border-rose-200"
							}`}
						>
							<span
								className={`w-2 h-2 rounded-full ${
									seatsLeft > 0 ? "bg-emerald-500" : "bg-rose-500"
								}`}
							/>
							<span>
								{seatsLeft > 0
									? `${seatsLeft} seats currently available for booking`
									: "All seats are fully booked for this schedule"}
							</span>
						</div>
					)}
				</div>

				{/* Footer Buttons */}
				<div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
					{/* Details Link */}
					<Link to={`/view-bus/${item.busId}`} className="flex-shrink-0">
						<button
							type="button"
							className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer"
						>
							<svg
								className="w-3.5 h-3.5 text-slate-500"
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
							<span>Details</span>
						</button>
					</Link>

					{/* Primary Seat Action Button */}
					<div className="flex-1 flex items-center justify-end">
						{!isActive || (!isLoading && !hasResult) ? (
							<button
								type="button"
								onClick={() =>
									onShowSeat(
										item.busId,
										item.sourceStationName,
										item.destinationStationName
									)
								}
								className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all duration-150 active:scale-95 cursor-pointer"
							>
								<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								<span>Check Seats</span>
							</button>
						) : isLoading ? (
							<button
								type="button"
								disabled
								className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600/75 text-white text-xs font-bold rounded-xl cursor-not-allowed"
							>
								<div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Checking...</span>
							</button>
						) : hasResult && seatsLeft > 0 ? (
							<Link
								to={`/book-ticket/${item.busId}/${item.sourceStationName}/${item.destinationStationName}/${date}`}
							>
								<button
									type="button"
									className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95 cursor-pointer"
								>
									<span>Book Now</span>
									<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
									</svg>
								</button>
							</Link>
						) : (
							<button
								type="button"
								onClick={() =>
									onShowSeat(
										item.busId,
										item.sourceStationName,
										item.destinationStationName
									)
								}
								className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all duration-150 border border-slate-200 cursor-pointer"
							>
								<span>Retry</span>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusCard;
