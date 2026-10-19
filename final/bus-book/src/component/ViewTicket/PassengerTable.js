import React from "react";
import Checkbox from "../Checkbox";

const PassengerTable = ({ data, cancelTicketIds, cancelLoading, onCancelClick, onSelectTicket }) => {
	if (!data || !data.seatDetails) return null;

	const isCompleted = data?.bookingDate ? new Date(data.bookingDate) < new Date() : false;

	return (
		<div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden mb-6">
			{/* Header */}
			<div className="flex flex-wrap justify-between items-center px-6 py-4 border-b border-surface-100 bg-surface-50/70 gap-3">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div>
						<h2 className="font-bold text-surface-900 text-base">Passenger List</h2>
						<p className="text-xs text-surface-500">
							{data.seatDetails.length} {data.seatDetails.length === 1 ? "passenger" : "passengers"} on this ticket
						</p>
					</div>
				</div>

				<button
					className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 shadow-sm ${
						cancelTicketIds.length === 0
							? "opacity-50 cursor-not-allowed bg-surface-100 border-surface-200 text-surface-400"
							: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300 active:scale-95 shadow-rose-100"
					}`}
					onClick={onCancelClick}
					disabled={cancelLoading || cancelTicketIds.length === 0}
				>
					<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
					Cancel Selected ({cancelTicketIds.length})
				</button>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-surface-100 bg-surface-50/50 text-[11px] font-bold text-surface-500 uppercase tracking-wider">
							<th className="py-3 px-6 text-center w-16">Select</th>
							<th className="py-3 px-6">Passenger</th>
							<th className="py-3 px-6 text-center">Seat</th>
							<th className="py-3 px-6 text-center">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-surface-100">
						{data.seatDetails.map((item, ind) => {
							const isCancelled = item.status === "CANCELLED";
							const isRowCompleted = isCompleted;
							const initial = (item.name || "P").charAt(0).toUpperCase();

							return (
								<tr
									key={ind}
									className={`transition-colors duration-150 ${
										cancelTicketIds.includes(item?.id)
											? "bg-rose-50/30"
											: isCancelled
											? "bg-surface-50/40 opacity-75"
											: "hover:bg-blue-50/30"
									}`}
								>
									{/* Checkbox */}
									<td className="py-3.5 px-6 text-center">
										<div className="flex justify-center">
											<Checkbox
												size="sm"
												variant="rose"
												disabled={isCancelled || isRowCompleted}
												checked={cancelTicketIds.includes(item?.id)}
												onChange={(e) => onSelectTicket(e.target.checked, item?.id)}
												id={`cancel-passenger-${item?.id || ind}`}
												aria-label={`Select ${item.name} for cancellation`}
											/>
										</div>
									</td>

									{/* Name with avatar */}
									<td className="py-3.5 px-6">
										<div className="flex items-center gap-3">
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
													isCancelled
														? "bg-rose-100 text-rose-700"
														: isRowCompleted
														? "bg-surface-200 text-surface-700"
														: "bg-blue-100 text-blue-700"
												}`}
											>
												{initial}
											</div>
											<div>
												<p className="font-bold text-surface-900 leading-tight">{item.name}</p>
												<p className="text-[11px] text-surface-500 font-medium">Passenger #{ind + 1}</p>
											</div>
										</div>
									</td>

									{/* Seat Number */}
									<td className="py-3.5 px-6 text-center">
										<span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
											<svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
												/>
											</svg>
											Seat {item.seatNumber}
										</span>
									</td>

									{/* Status */}
									<td className="py-3.5 px-6 text-center">
										{isCancelled ? (
											<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
												<span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
												Cancelled
											</span>
										) : isRowCompleted ? (
											<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
												<span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
												Completed
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
												<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
												{item.status === "CONFIRMED" ? "Confirmed" : item.status}
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

export default PassengerTable;
