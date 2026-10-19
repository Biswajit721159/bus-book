import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getFormattedDate } from "../../utilities/date";
import { toast } from "react-toastify";

const TicketResultCard = ({ data }) => {
	const [copied, setCopied] = useState(false);

	if (!data) return null;

	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const hasPassed = data.bookingDate ? new Date(data.bookingDate) < todayStart : false;
	const isCancelled = (data.bookingStatus || "").toUpperCase() === "CANCELLED";
	const isCompleted = hasPassed && !isCancelled;
	const isConfirmed = !hasPassed && !isCancelled;

	const pnr = data.pnrNumber || (data.bookingId ? `#${data.bookingId}` : "N/A");
	const fare = data.totalDistance ? data.totalDistance * 5 * (data.seatMap?.length || 1) : null;

	const copyPnrToClipboard = () => {
		if (data.pnrNumber || data.bookingId) {
			navigator.clipboard.writeText(data.pnrNumber || String(data.bookingId));
			setCopied(true);
			toast.info("PNR copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="mt-8 bg-white border border-slate-200 rounded-3xl overflow-hidden print:border-none">
			{/* Top Header Ribbon */}
			<div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
						</svg>
					</div>
					<div>
						<span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">
							Verified Boarding Pass
						</span>
						<div className="flex items-center gap-2">
							<span className="text-base font-mono font-black tracking-wider text-white">
								PNR: {pnr}
							</span>
							<button
								type="button"
								onClick={copyPnrToClipboard}
								className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white transition-colors"
								title="Copy PNR"
							>
								{copied ? (
									<svg className="w-3.5 h-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
									</svg>
								) : (
									<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Status Badge */}
				<div className="flex items-center gap-2">
					{isConfirmed && (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 backdrop-blur-sm">
							<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
							CONFIRMED
						</span>
					)}
					{isCompleted && (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-200 border border-blue-400/40 backdrop-blur-sm">
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
							</svg>
							JOURNEY COMPLETED
						</span>
					)}
					{isCancelled && (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-200 border border-rose-400/40 backdrop-blur-sm">
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
							</svg>
							CANCELLED
						</span>
					)}
				</div>
			</div>

			{/* Main Ticket Body */}
			<div className="p-6 sm:p-8">
				{/* Route & Journey Timeline */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-100">
					{/* Departure Origin */}
					<div className="md:col-span-4">
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
							Origin Station
						</span>
						<h3 className="text-xl font-black text-slate-900 leading-tight">
							{data.sourceStationName || "Source"}
						</h3>
						<p className="text-xs font-semibold text-blue-600 mt-1">
							{data.sourceArrivalTime || "Boarding point"}
						</p>
					</div>

					{/* Route Graphic */}
					<div className="md:col-span-4 flex flex-col items-center justify-center">
						<div className="w-full flex items-center gap-2 justify-center">
							<div className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 bg-white" />
							<div className="flex-1 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 relative">
								<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-slate-400">
									<svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
										<path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z" />
									</svg>
								</div>
							</div>
							<div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
						</div>
						<div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-slate-500">
							<span>{data.totalDistance ? `${data.totalDistance} km` : "Express"}</span>
						</div>
					</div>

					{/* Arrival Destination */}
					<div className="md:col-span-4 text-left md:text-right">
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
							Destination Station
						</span>
						<h3 className="text-xl font-black text-slate-900 leading-tight">
							{data.distStationStationName || data.destinationStationName || "Destination"}
						</h3>
						<p className="text-xs font-semibold text-indigo-600 mt-1">
							{data.distArrivalTime || "Drop-off point"}
						</p>
					</div>
				</div>

				{/* Booking Details Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-b border-slate-100">
					<div>
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
							Travel Date
						</span>
						<p className="text-sm font-extrabold text-slate-800">
							{getFormattedDate(data.bookingDate)}
						</p>
					</div>
					<div>
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
							Bus Operator
						</span>
						<p className="text-sm font-extrabold text-slate-800 truncate" title={data.busName}>
							{data.busName || "Express Bus"}
						</p>
					</div>
					<div>
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
							Booked On
						</span>
						<p className="text-sm font-semibold text-slate-600">
							{getFormattedDate(data.bookedAt || data.createdAt)}
						</p>
					</div>
					<div>
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
							Total Fare
						</span>
						<p className="text-base font-black text-emerald-700">
							₹{data.totalPrice || fare || "Paid"}
						</p>
					</div>
				</div>

				{/* Perforated Separator with side notches */}
				<div className="relative my-6 -mx-6 sm:-mx-8">
					<div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-50 rounded-full border-r border-slate-200" />
					<div className="border-t-2 border-dashed border-slate-200 mx-6" />
					<div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-50 rounded-full border-l border-slate-200" />
				</div>

				{/* Passenger & Seat Allocation */}
				<div>
					<h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
						<svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Reserved Passenger Seats ({data.seatMap?.length || 0})
					</h4>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{data.seatMap && data.seatMap.length > 0 ? (
							data.seatMap.map((seat, ind) => {
								const isSeatActive = (seat.status || "CONFIRMED").toUpperCase() === "CONFIRMED";
								return (
									<div
										key={seat.id || ind}
										className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 hover:bg-slate-100/70 transition-colors"
									>
										<div className="flex items-center gap-2.5">
											<div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
												{seat.seatNumber || ind + 1}
											</div>
											<div>
												<p className="text-xs font-bold text-slate-900">
													Passenger #{ind + 1}
												</p>
												<p className="text-[10px] text-slate-500 font-medium">
													Seat {seat.seatNumber || ind + 1}
												</p>
											</div>
										</div>

										<span
											className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
												isSeatActive
													? isCompleted
														? "bg-blue-100 text-blue-800"
														: "bg-emerald-100 text-emerald-800"
													: "bg-rose-100 text-rose-800"
											}`}
										>
											{isSeatActive ? (isCompleted ? "Completed" : "Confirmed") : "Cancelled"}
										</span>
									</div>
								);
							})
						) : (
							<div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
								Seat details recorded under PNR #{pnr}
							</div>
						)}
					</div>
				</div>

				{/* Ticket Actions Bar */}
				<div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
					<div className="flex items-center gap-2">
						{data.busId && (
							<Link to={`/view-bus/${data.busId}`}>
								<button
									type="button"
									className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors"
								>
									<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									View Bus Route & Reviews
								</button>
							</Link>
						)}
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => window.print()}
							className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all active:scale-95"
						>
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
							</svg>
							Print / Download Ticket
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TicketResultCard;
