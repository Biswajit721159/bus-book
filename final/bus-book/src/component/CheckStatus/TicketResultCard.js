import React from "react";
import { getFormattedDate } from "../../utilities/date";

const TicketResultCard = ({ data }) => {
	if (!data) return null;

	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const hasPassed = data.bookingDate ? new Date(data.bookingDate) < todayStart : false;

	return (
		<div className="card overflow-hidden mt-6 shadow-sm border border-surface-200 rounded-2xl bg-white animate-slide-up">
			{/* Journey Summary */}
			<div className="px-6 py-5 bg-surface-50/50 border-b border-surface-100">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					<div>
						<p className="text-xs text-surface-500 mb-1">Bus Name</p>
						<p className="text-sm font-semibold text-surface-900">{data.busName}</p>
					</div>
					<div>
						<p className="text-xs text-surface-500 mb-1">Route</p>
						<p
							className="text-sm font-semibold text-surface-900 truncate"
							title={`${data.sourceStationName} → ${data.distStationStationName}`}
						>
							{data.sourceStationName} → {data.distStationStationName}
						</p>
					</div>
					<div>
						<p className="text-xs text-surface-500 mb-1">Booking Status</p>
						<div className="flex items-center mt-0.5">
							{(data.bookingStatus || "CONFIRMED") === "CONFIRMED" ? (
								hasPassed ? (
									<span className="badge bg-blue-500 text-white border border-blue-100 px-2.5 py-0.5 rounded text-xs font-medium">
										Completed
									</span>
								) : (
									<span className="badge bg-green-500 text-white border border-green-100 px-2.5 py-0.5 rounded text-xs font-medium">
										Confirmed
									</span>
								)
							) : (data.bookingStatus || "CONFIRMED") === "CANCELLED" ? (
								<span className="badge bg-red-500 text-white border border-red-100 px-2.5 py-0.5 rounded text-xs font-medium">
									Cancelled
								</span>
							) : (
								<span className="badge bg-surface-100 text-surface-700 border border-surface-200 px-2.5 py-0.5 rounded text-xs font-medium">
									{data.bookingStatus}
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="mt-4 pt-4 border-t border-surface-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
					<div>
						<p className="text-xs text-surface-500 mb-1">Travel Date</p>
						<p className="text-sm font-semibold text-surface-900">
							{getFormattedDate(data.bookingDate)}
						</p>
					</div>
					<div>
						<p className="text-xs text-surface-500 mb-1">Booking Date</p>
						<p className="text-sm font-semibold text-surface-900">
							{getFormattedDate(data.bookedAt)}
						</p>
					</div>
					<div>
						<p className="text-xs text-surface-500 mb-1">Distance</p>
						<p className="text-sm font-semibold text-surface-900">{data.totalDistance} km</p>
					</div>
				</div>
			</div>

			{/* Passengers Table */}
			<div className="table-container border-0 shadow-none rounded-none overflow-x-auto">
				<table className="table-base w-full border-collapse">
					<thead className="table-head bg-surface-50 border-b border-surface-100">
						<tr>
							<th className="table-th w-16 text-center py-3">#</th>
							<th className="table-th py-3 text-left">Passenger</th>
							<th className="table-th py-3 text-left">Seat No.</th>
							<th className="table-th py-3 text-left">Status</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-surface-100">
						{data.seatMap?.map((seat, ind) => {
							const isActive = seat.status === "CONFIRMED";

							return (
								<tr key={ind} className="table-row transition-colors hover:bg-surface-50/50">
									<td className="table-td text-surface-500 font-medium text-center py-4">
										{ind + 1}
									</td>
									<td className="table-td font-medium text-surface-800 py-4">
										Passenger {ind + 1}
									</td>
									<td className="table-td py-4">
										<span className="badge badge-blue bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-xs font-semibold">
											Seat {seat.seatNumber}
										</span>
									</td>
									<td className="table-td py-4">
										{isActive ? (
											hasPassed ? (
												<span className="badge bg-blue-500 text-white border border-blue-100 px-2.5 py-0.5 rounded text-xs font-medium">
													Completed
												</span>
											) : (
												<span className="badge bg-green-500 text-white border border-green-100 px-2.5 py-0.5 rounded text-xs font-medium">
													Confirmed
												</span>
											)
										) : (
											<span className="badge bg-red-500 text-white border border-red-100 px-2.5 py-0.5 rounded text-xs font-medium">
												Cancelled
											</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TicketResultCard;
