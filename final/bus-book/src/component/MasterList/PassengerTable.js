import React from "react";

const PassengerTable = ({
	data,
	deleteLoadingId,
	onEditClick,
	onDeleteClick,
}) => {
	if (!data || data.length === 0) return null;

	return (
		<div className="table-container shadow-sm border border-surface-200 rounded-xl overflow-hidden bg-white">
			<table className="table-base w-full border-collapse">
				<thead className="table-head bg-surface-50 border-b border-surface-150">
					<tr>
						<th className="table-th w-16 text-center py-3">#</th>
						<th className="table-th py-3 text-left">Name</th>
						<th className="table-th py-3 text-right px-6">Actions</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-surface-100">
					{data.map((item, ind) => {
						const itemId = item.id || item._id;
						return (
							<tr key={ind} className="table-row transition-colors hover:bg-surface-50/50">
								<td className="table-td text-surface-500 font-medium text-center py-3">
									{ind + 1}
								</td>
								<td className="table-td py-3">
									<div className="flex items-center gap-3">
										<div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0 border border-primary-100">
											{item.name[0].toUpperCase()}
										</div>
										<span className="font-semibold text-surface-800">
											{item.name}
										</span>
									</div>
								</td>
								<td className="table-td py-3 px-6 text-right">
									<div className="flex items-center justify-end gap-2">
										<button
											onClick={() => onEditClick(itemId, item.name)}
											className="btn-secondary btn-sm flex items-center gap-1.5"
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
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
											Edit
										</button>
										<button
											onClick={() => onDeleteClick(itemId)}
											disabled={deleteLoadingId === itemId}
											className="btn-danger btn-sm flex items-center gap-1.5"
										>
											{deleteLoadingId === itemId ? (
												<div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											) : (
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
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											)}
											Delete
										</button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default PassengerTable;
