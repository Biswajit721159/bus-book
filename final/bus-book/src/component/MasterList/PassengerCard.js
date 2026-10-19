import React from "react";

// Deterministic gradient palettes for avatar badges
const AVATAR_GRADIENTS = [
	{ bg: "from-blue-600 to-indigo-600", text: "text-white", border: "border-blue-200", lightBg: "bg-blue-50 text-blue-700" },
	{ bg: "from-emerald-500 to-teal-600", text: "text-white", border: "border-emerald-200", lightBg: "bg-emerald-50 text-emerald-700" },
	{ bg: "from-purple-600 to-pink-600", text: "text-white", border: "border-purple-200", lightBg: "bg-purple-50 text-purple-700" },
	{ bg: "from-amber-500 to-orange-600", text: "text-white", border: "border-amber-200", lightBg: "bg-amber-50 text-amber-700" },
	{ bg: "from-rose-500 to-red-600", text: "text-white", border: "border-rose-200", lightBg: "bg-rose-50 text-rose-700" },
	{ bg: "from-cyan-600 to-blue-600", text: "text-white", border: "border-cyan-200", lightBg: "bg-cyan-50 text-cyan-700" },
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

const PassengerCard = ({
	item,
	index,
	onEdit,
	onDelete,
	onCopy,
	deleteLoadingId,
}) => {
	const itemId = item.id || item._id;
	const isDeleting = deleteLoadingId === itemId;
	const palette = getGradientForName(item.name);
	const initials = getInitials(item.name);

	return (
		<div className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between">
			{/* Top Bar: Serial Pill & Quick Copy */}
			<div className="flex items-start justify-between gap-2 mb-4">
				<div className="flex items-center gap-2">
					<span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200/60">
						#{String(index + 1).padStart(2, "0")}
					</span>
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
						<svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
						</svg>
						Verified Traveler
					</span>
				</div>

				<button
					type="button"
					onClick={() => onCopy(item.name)}
					className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-80 group-hover:opacity-100"
					title="Copy name"
					aria-label="Copy passenger name"
				>
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
				</button>
			</div>

			{/* Passenger Info Row */}
			<div className="flex items-center gap-3.5 mb-5">
				<div
					className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${palette.bg} ${palette.text} flex items-center justify-center font-extrabold text-sm shadow-sm flex-shrink-0 tracking-wider`}
				>
					{initials}
				</div>
				<div className="min-w-0 flex-1">
					<h3 className="text-base font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
						{item.name}
					</h3>
					<div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
						<span className="flex items-center gap-1">
							<svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							Saved: {formatDate(item.createdAt || item.updatedAt)}
						</span>
						<span className="text-slate-300">·</span>
						<span>Updated: {formatDate(item.updatedAt || item.createdAt)}</span>
					</div>
				</div>
			</div>

			{/* Action Buttons Row */}
			<div className="pt-3 border-t border-slate-100 flex items-center gap-2">
				<button
					type="button"
					onClick={() => onEdit(itemId, item.name)}
					className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 hover:border-blue-200 transition-all duration-150"
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
					onClick={() => onDelete(itemId, item.name)}
					disabled={isDeleting}
					className="inline-flex items-center justify-center p-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border border-rose-200/70 transition-all duration-150 disabled:opacity-50"
					title="Delete passenger"
					aria-label="Delete passenger"
				>
					{isDeleting ? (
						<div className="w-3.5 h-3.5 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
					) : (
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	);
};

export default PassengerCard;
