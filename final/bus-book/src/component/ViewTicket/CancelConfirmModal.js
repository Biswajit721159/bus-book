import React from "react";

const CancelConfirmModal = ({ isOpen, isLoading, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div className="modal-box p-0 overflow-hidden shadow-2xl rounded-2xl bg-white border border-surface-100">
				{/* Modal Header */}
				<div className="px-6 py-5 border-b border-surface-100">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg
								className="w-5 h-5 text-red-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<div>
							<h3 className="font-semibold text-surface-900 text-base">Cancel Ticket</h3>
							<p className="text-xs text-surface-500 mt-0.5">
								This action cannot be undone
							</p>
						</div>
					</div>
				</div>

				{/* Modal Body */}
				<div className="px-6 py-5">
					<p className="text-sm text-surface-600 leading-relaxed">
						Are you sure you want to cancel the selected seat(s)? The selected seat(s) will be released and this action is permanent.
					</p>
				</div>

				{/* Modal Footer */}
				<div className="flex gap-3 px-6 py-4 border-t border-surface-100 bg-surface-50/50">
					<button onClick={onClose} disabled={isLoading} className="btn-secondary flex-1 py-2.5 rounded-lg border-surface-200">
						Keep Ticket
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className="btn-danger flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Cancelling...
							</>
						) : (
							"Yes, Cancel"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CancelConfirmModal;
