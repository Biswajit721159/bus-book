const PassengerTable = ({ data, cancelTicketIds, cancelLoading, onCancelClick, onSelectTicket }) => {
	if (!data || !data.seatDetails) return null;

	const isCompleted = data?.bookingDate ? new Date(data.bookingDate) < new Date() : false;

	return (
		<div className="card overflow-hidden shadow-sm border border-surface-200 rounded-xl bg-white">
			<div className="flex justify-between items-center px-6 py-4 border-b border-surface-100 bg-surface-50/50">
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-surface-900 text-lg">Passengers</h2>
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-surface-600">
						{data.seatDetails.length} total
					</span>
				</div>
				<button
					className={`btn-danger btn-sm flex items-center gap-1.5 transition-all duration-150 ${
						cancelTicketIds.length === 0
							? "opacity-50 cursor-not-allowed bg-surface-100 border-surface-200 text-surface-400 hover:bg-surface-100"
							: ""
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

			<div className="table-container border-0 shadow-none rounded-none overflow-x-auto">
				<table className="table-base w-full border-collapse">
					<thead className="table-head">
						<tr>
							<th className="table-th py-3 text-left text-center">Select</th>
							<th className="table-th py-3 text-left text-center">Name</th>
							<th className="table-th py-3 text-left text-center">Seat No</th>
							<th className="table-th py-3 text-left text-center">Status</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-surface-100">
						{data.seatDetails.map((item, ind) => {
							const isCancelled = item.status === "CANCELLED";
							const isRowCompleted = isCompleted;

							return (
								<tr key={ind} className="table-row transition-colors hover:bg-surface-50/50">
									<td className="table-td font-medium text-surface-900 py-3 text-center">
										<input
											className="w-3.5 h-3.5 border border-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-150"
											type="checkbox"
											disabled={isCancelled || isRowCompleted}
											checked={cancelTicketIds.includes(item?.id)}
											onChange={(e) => onSelectTicket(e.target.checked, item?.id)}
										/>
									</td>
									<td className="table-td font-medium text-surface-900 py-3 text-center">
										{item.name}
									</td>
									<td className="table-td py-3 text-center">
										<span className="badge badge-blue bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-xs font-semibold">
											Seat {item.seatNumber}
										</span>
									</td>
									<td className="table-td py-3 text-center">
										{isCancelled ? (
											<span className="badge bg-red-500 text-white border border-red-100 px-2.5 py-0.5 rounded text-xs font-medium">
												Cancelled
											</span>
										) : isRowCompleted ? (
											<span className="badge bg-blue-500 text-white border border-blue-100 px-2.5 py-0.5 rounded text-xs font-medium">
												Completed
											</span>
										) : (
											<span className="badge bg-green-500 text-white border border-green-100 px-2.5 py-0.5 rounded text-xs font-medium">
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
