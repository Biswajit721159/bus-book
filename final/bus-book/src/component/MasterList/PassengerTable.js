import React from "react";

// Deterministic gradient palettes for avatar badges
const AVATAR_GRADIENTS = [
	{ bg: "from-blue-600 to-indigo-600", text: "text-white" },
	{ bg: "from-emerald-500 to-teal-600", text: "text-white" },
	{ bg: "from-purple-600 to-pink-600", text: "text-white" },
	{ bg: "from-amber-500 to-orange-600", text: "text-white" },
	{ bg: "from-rose-500 to-red-600", text: "text-white" },
	{ bg: "from-cyan-600 to-blue-600", text: "text-white" },
];

const getGradientForName = (name = "") => {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	const idx = Math.abs(hash) % AVATAR_GRADIENTS.length;
	return AVATAR_GRADIENTS[idx];
};

const getInitials = (name = "") => {
	const parts = name.trim().split(" ").filter(Boolean);
	if (parts.length === 0) return "P";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (dateString) => {
	if (!dateString) return "Recently saved";
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch {
		return "Recently saved";
	}
};

const PassengerTable = ({
	data,
	deleteLoadingId,
	onEditClick,
	onDeleteClick,
	onCopyClick = () => {},
}) => {
	if (!data || data.length === 0) return null;

	return (
		<div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
							<th className="py-3.5 px-4 w-16 text-center">#</th>
							<th className="py-3.5 px-4">Passenger Details</th>
							<th className="py-3.5 px-4 hidden sm:table-cell">Status</th>
							<th className="py-3.5 px-4 hidden md:table-cell">Saved Date</th>
							<th className="py-3.5 px-4 hidden md:table-cell">Last Update</th>
							<th className="py-3.5 px-6 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 text-sm">
						{data.map((item, ind) => {
							const itemId = item.id || item._id;
							const isDeleting = deleteLoadingId === itemId;
							const palette = getGradientForName(item.name);
							const initials = getInitials(item.name);

							return (
								<tr
									key={itemId || ind}
									className="group hover:bg-blue-50/30 transition-colors duration-150"
								>
									{/* Index */}
									<td className="py-4 px-4 text-center">
										<span className="inline-block px-2 py-0.5 rounded-md text-xs font-bold text-slate-500 bg-slate-100">
											#{String(ind + 1).padStart(2, "0")}
										</span>
									</td>

									{/* Name & Avatar */}
									<td className="py-4 px-4">
										<div className="flex items-center gap-3">
											<div
												className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${palette.bg} ${palette.text} flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0`}
											>
												{initials}
											</div>
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
														{item.name}
													</p>
													<button
														type="button"
														onClick={() => onCopyClick(item.name)}
														className="text-slate-300 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
														title="Copy name"
													>
														<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
															/>
														</svg>
													</button>
												</div>
												<span className="sm:hidden text-[11px] text-slate-400 mt-0.5 block">
													Updated: {formatDate(item.updatedAt || item.createdAt)}
												</span>
											</div>
										</div>
									</td>

									{/* Status Badge */}
									<td className="py-4 px-4 hidden sm:table-cell">
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
											Verified Traveler
										</span>
									</td>

									{/* Saved Date */}
									<td className="py-4 px-4 hidden md:table-cell text-xs text-slate-500 font-medium">
										{formatDate(item.createdAt || item.updatedAt)}
									</td>

									{/* Last Update */}
									<td className="py-4 px-4 hidden md:table-cell text-xs text-slate-500 font-medium">
										{formatDate(item.updatedAt || item.createdAt)}
									</td>

									{/* Actions */}
									<td className="py-4 px-6 text-center">
										<div className="flex items-center justify-center gap-2">
											<button
												type="button"
												onClick={() => onEditClick(itemId, item.name)}
												className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all duration-150"
											>
												<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
													/>
												</svg>
												<span>Edit</span>
											</button>

											<button
												type="button"
												onClick={() => onDeleteClick(itemId, item.name)}
												disabled={isDeleting}
												className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-all duration-150 disabled:opacity-50"
											>
												{isDeleting ? (
													<div className="w-3.5 h-3.5 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
												) : (
													<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
														/>
													</svg>
												)}
												<span>Delete</span>
											</button>
										</div>
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
