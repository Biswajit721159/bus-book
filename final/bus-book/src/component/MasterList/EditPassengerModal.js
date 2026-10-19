import React from "react";
import { Spinner } from "../Loader";

const EditPassengerModal = ({
	isOpen,
	name,
	nameError,
	isLoading,
	onChangeName,
	onClose,
	onSubmit,
}) => {
	if (!isOpen) return null;

	const charCount = (name || "").length;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-slide-up">
				{/* Modal Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
						</div>
						<div>
							<h2 className="text-lg font-bold text-slate-900">Edit Passenger Profile</h2>
							<p className="text-xs text-slate-500 mt-0.5">
								Update saved passenger information
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="w-8 h-8 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
						aria-label="Close modal"
					>
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 space-y-4">
					<div>
						<div className="flex items-center justify-between mb-1.5">
							<label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
								Full Name <span className="text-rose-500">*</span>
							</label>
							<span
								className={`text-[11px] font-semibold ${
									charCount > 50
										? "text-rose-600"
										: charCount >= 3
										? "text-emerald-600"
										: "text-slate-400"
								}`}
							>
								{charCount}/50 chars
							</span>
						</div>

						<div className="relative">
							<input
								type="text"
								value={name}
								onChange={(e) => onChangeName(e.target.value)}
								className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
									nameError
										? "border-rose-400 focus:ring-rose-400/20"
										: "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
								}`}
								placeholder="e.g. Biswajit Ghosh"
								autoFocus
								spellCheck={false}
								maxLength={50}
								onKeyDown={(e) => e.key === "Enter" && onSubmit()}
							/>
							{name && (
								<button
									type="button"
									onClick={() => onChangeName("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							)}
						</div>

						{nameError ? (
							<p className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
								<svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
								<span>{nameError}</span>
							</p>
						) : (
							<p className="mt-1.5 text-[11px] text-slate-400">
								Only alphabets and spaces allowed (3 to 50 characters).
							</p>
						)}
					</div>

					<div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
						<svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>
							Updating this name will immediately update the 1-click booking autofill for all upcoming journeys.
						</span>
					</div>
				</div>

				{/* Modal Footer */}
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
						onClick={onSubmit}
						disabled={isLoading || !name.trim()}
						className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150"
					>
						{isLoading ? (
							<>
								<Spinner size="xs" color="white" />
								<span>Saving Changes...</span>
							</>
						) : (
							<>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								<span>Save Changes</span>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditPassengerModal;
