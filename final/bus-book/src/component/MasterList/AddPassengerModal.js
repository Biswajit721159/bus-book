import React from "react";

const AddPassengerModal = ({
	isOpen,
	name,
	nameError,
	isLoading,
	onChangeName,
	onClose,
	onSubmit,
}) => {
	if (!isOpen) return null;

	return (
		<div
			className="modal-overlay"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="modal-box p-0 overflow-hidden shadow-2xl rounded-2xl bg-white border border-surface-100 animate-slide-up">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
					<h2 className="text-lg font-bold text-surface-900">Add Passenger</h2>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Body */}
				<div className="px-6 py-5">
					<label className="label font-semibold text-sm text-surface-700 mb-1.5 block">Full Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => onChangeName(e.target.value)}
						className={`input-field ${nameError ? "input-error border-red-400 focus:ring-red-400" : ""}`}
						placeholder="e.g. John Doe"
						autoFocus
						spellCheck={false}
						onKeyDown={(e) => e.key === "Enter" && onSubmit()}
					/>
					{nameError && <p className="mt-1.5 text-xs text-red-600">{nameError}</p>}
				</div>

				{/* Footer */}
				<div className="flex gap-3 px-6 py-4 border-t border-surface-100 bg-surface-50/50">
					<button onClick={onClose} disabled={isLoading} className="btn-secondary flex-1 py-2.5 rounded-lg">
						Cancel
					</button>
					<button
						onClick={onSubmit}
						disabled={isLoading}
						className="btn-primary flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Adding...
							</>
						) : (
							"Add Passenger"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddPassengerModal;
