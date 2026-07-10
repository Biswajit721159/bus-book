import React from "react";

const PassengerModal = ({
	modalOpen,
	setModalOpen,
	MasterList,
	checkbox,
	handleCheckboxChange,
	seatarr,
	pay,
	goToPayment,
	isSeatLocking,
}) => {
	if (!modalOpen) return null;

	return (
		<div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
			<div className="modal-box p-0 overflow-hidden">
				<div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
					<div>
						<h2 className="text-lg font-semibold text-surface-900">Assign Passengers</h2>
						<p className="text-xs text-surface-500 mt-0.5">Select one passenger per seat</p>
					</div>
					<button
						onClick={() => setModalOpen(false)}
						className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors"
					>
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="px-6 py-4">
					<div className="table-container">
						<table className="table-base">
							<thead className="table-head">
								<tr>
									<th className="table-th">#</th>
									<th className="table-th">Passenger Name</th>
									<th className="table-th">Select</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-surface-100">
								{MasterList.map((item, ind) => {
									const itemId = item.id || item._id;
									return (
										<tr key={ind} className="table-row">
											<td className="table-td text-surface-500">{ind + 1}</td>
											<td className="table-td font-medium text-surface-800">{item.name}</td>
											<td className="table-td">
												<button
													onClick={() => handleCheckboxChange(itemId)}
													className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
														checkbox.includes(itemId)
															? "bg-primary-600 border-primary-600"
															: "border-surface-300 hover:border-primary-400"
													}`}
												>
													{checkbox.includes(itemId) && (
														<svg
															className="w-3 h-3 text-white"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																fillRule="evenodd"
																d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																clipRule="evenodd"
															/>
														</svg>
													)}
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<div className="mt-4 p-4 bg-surface-50 rounded-xl">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-surface-500">Selected seats</p>
								<p className="text-sm font-semibold text-surface-900">
									{seatarr.length} seat(s)
								</p>
							</div>
							<div>
								<p className="text-xs text-surface-500">Passengers assigned</p>
								<p className="text-sm font-semibold text-surface-900">{checkbox.length}</p>
							</div>
							<div>
								<p className="text-xs text-surface-500">Total amount</p>
								<p className="text-lg font-bold text-green-700">₹{pay}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-3 px-6 py-4 border-t border-surface-100">
					<button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
						Cancel
					</button>
					<button
						onClick={goToPayment}
						disabled={
							checkbox.length === 0 || checkbox.length !== seatarr.length || isSeatLocking
						}
						className="btn-primary flex-1"
					>
						{isSeatLocking ? "Please wait..." : "Confirm Booking"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PassengerModal;
