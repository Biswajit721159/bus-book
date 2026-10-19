import React from "react";

const PaymentSummary = ({
	src,
	dist,
	date,
	totalDistance,
	seat_record = [],
	person = [],
	total_money,
}) => {
	const pricePerSeat = totalDistance * 5;
	const seatCount = seat_record.length || person.length || 1;

	return (
		<div className="space-y-4">
			{/* Main Booking Summary Card */}
			<div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
				{/* Card Header with Brand Accent */}
				<div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white">
					<div className="flex items-center justify-between">
						<span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
							Booking Summary
						</span>
						<span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 backdrop-blur-xs text-white border border-white/25">
							{seatCount} {seatCount === 1 ? "Seat" : "Seats"}
						</span>
					</div>

					{/* Route & Stations */}
					<div className="mt-3 flex items-center justify-between gap-2">
						<div className="min-w-0 flex-1">
							<p className="text-base font-extrabold text-white truncate" title={src}>
								{src}
							</p>
							<span className="text-[10px] text-blue-200 font-medium">Origin</span>
						</div>
						<div className="flex flex-col items-center flex-shrink-0 px-2">
							<svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
							<span className="text-[10px] text-blue-100 font-semibold">{totalDistance} km</span>
						</div>
						<div className="min-w-0 flex-1 text-right">
							<p className="text-base font-extrabold text-white truncate" title={dist}>
								{dist}
							</p>
							<span className="text-[10px] text-blue-200 font-medium">Destination</span>
						</div>
					</div>
				</div>

				<div className="p-5 space-y-4">
					{/* Travel Details Strip */}
					<div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
						<span className="font-semibold text-slate-500 uppercase tracking-wide">
							Travel Date
						</span>
						<span className="font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
							{date}
						</span>
					</div>

					{/* Assigned Passengers & Seats */}
					<div>
						<div className="flex items-center justify-between mb-2.5">
							<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
								Passengers & Seats
							</span>
							<span className="text-[11px] font-bold text-slate-400">
								{person.length} Assigned
							</span>
						</div>

						<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
							{person.map((name, i) => {
								const seatNumber = seat_record[i];
								return (
									<div
										key={i}
										className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100 transition-colors"
									>
										<div className="flex items-center gap-2.5 min-w-0">
											<div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
												{name ? name[0].toUpperCase() : i + 1}
											</div>
											<span className="text-xs font-bold text-slate-800 truncate" title={name}>
												{name}
											</span>
										</div>
										{seatNumber && (
											<span className="px-2.5 py-0.5 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-700 shadow-2xs flex-shrink-0">
												Seat {seatNumber}
											</span>
										)}
									</div>
								);
							})}
						</div>
					</div>

					{/* Fare Calculation Breakdown */}
					<div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
						<div className="flex justify-between items-center text-slate-600">
							<span>Base Fare ({seatCount} × ₹{pricePerSeat})</span>
							<span className="font-bold text-slate-900">₹{pricePerSeat * seatCount}</span>
						</div>
						<div className="flex justify-between items-center text-slate-600">
							<span>Taxes & Service Fees</span>
							<span className="font-bold text-emerald-600">FREE</span>
						</div>
					</div>

					{/* Total Amount Block */}
					<div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 flex items-center justify-between">
						<div>
							<p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
								Grand Total
							</p>
							<p className="text-[11px] text-slate-400 font-medium mt-0.5">
								All inclusive
							</p>
						</div>
						<div className="text-right">
							<span className="text-2xl font-black text-blue-700 tracking-tight">
								₹{total_money}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Security & Guarantee Trust Card */}
			<div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-2.5 text-xs text-slate-600">
				<div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
					<svg className="w-4 h-4 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
					</svg>
					<span>Instant SMS & Email Confirmation</span>
				</div>
				<div className="flex items-center gap-2.5 text-blue-700 font-semibold">
					<svg className="w-4 h-4 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					<span>256-Bit SSL Encrypted Checkout</span>
				</div>
			</div>
		</div>
	);
};

export default PaymentSummary;
