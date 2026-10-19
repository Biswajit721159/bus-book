import React from "react";

const DeleteConfirmModal = ({
	isOpen,
	target,
	isLoading,
	onClose,
	onConfirm,
}) => {
	if (!isOpen || !target) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-slide-up">
				{/* Modal Header */}
				<div className="p-6 text-center">
					<div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4 shadow-2xs">
						<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.8}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</div>

					<h3 className="text-lg font-extrabold text-slate-900">
						Remove Passenger Profile?
					</h3>

					<p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
						Are you sure you want to remove{" "}
						<span className="font-bold text-slate-800">
							&ldquo;{target.name}&rdquo;
						</span>{" "}
						from your saved co-passengers list?
					</p>

					<div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 text-left flex items-start gap-2">
						<svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clipRule="evenodd"
							/>
						</svg>
						<span>
							This passenger will no longer appear in the 1-click autofill during seat assignment. Existing bookings will remain unaffected.
						</span>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50"
					>
						{isLoading ? (
							<>
								<div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Removing...</span>
							</>
						) : (
							<>
								<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								<span>Remove Passenger</span>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmModal;
