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
	return (
		<div className="space-y-4">
			<div className="card p-5">
				<h3 className="font-semibold text-surface-900 mb-4 border-b border-surface-100 pb-2">
					Journey Details
				</h3>
				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<span className="text-xs text-surface-500">Route</span>
						<span className="text-sm font-semibold text-surface-800">
							{src} → {dist}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-xs text-surface-500">Travel Date</span>
						<span className="text-sm font-semibold text-surface-800">{date}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-xs text-surface-500">Distance</span>
						<span className="text-sm font-medium text-surface-800">{totalDistance} km</span>
					</div>
				</div>
			</div>

			<div className="card p-5">
				<h3 className="font-semibold text-surface-900 mb-3 border-b border-surface-100 pb-2">
					Passengers & Seats ({person.length})
				</h3>
				<div className="space-y-3 max-h-56 overflow-y-auto pr-1">
					{person.map((name, i) => {
						const seatNumber = seat_record[i];
						return (
							<div key={i} className="flex items-center justify-between text-sm text-surface-700 py-0.5">
								<div className="flex items-center gap-2.5 min-w-0">
									<div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 flex-shrink-0">
										{name[0]?.toUpperCase()}
									</div>
									<span className="truncate font-medium">{name}</span>
								</div>
								{seatNumber && (
									<span className="badge badge-blue text-xs font-semibold px-2.5 py-1 flex-shrink-0">
										Seat {seatNumber}
									</span>
								)}
							</div>
						);
					})}
				</div>
			</div>

			<div className="card p-5 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
				<div className="flex justify-between items-center">
					<div>
						<p className="text-xs text-surface-500">Grand Total</p>
						<p className="text-[10px] text-surface-400">All taxes included</p>
					</div>
					<span className="text-2xl font-black text-indigo-700">₹{total_money}</span>
				</div>
			</div>
		</div>
	);
};

export default PaymentSummary;
