import React from "react";
import Checkbox from "../Checkbox";

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

	const allAssigned = checkbox.length === seatarr.length && seatarr.length > 0;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
			onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
		>
			<div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
				{/* Modal Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<div>
							<h2 className="text-lg font-bold text-slate-900">Assign Passengers</h2>
							<p className="text-xs text-slate-500 mt-0.5">
								Select exactly {seatarr.length} passenger{seatarr.length === 1 ? "" : "s"} for your selected seat{seatarr.length === 1 ? "" : "s"}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => setModalOpen(false)}
						className="w-8 h-8 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
						aria-label="Close modal"
					>
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 overflow-y-auto space-y-4 flex-1">
					{/* Selected Seats Pills */}
					<div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
						<div>
							<span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
								Target Seats:
							</span>
							<div className="flex items-center gap-1.5 flex-wrap mt-1">
								{seatarr.map((s) => (
									<span
										key={s}
										className="px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-700 shadow-2xs"
									>
										Seat {s}
									</span>
								))}
							</div>
						</div>
						<div className="text-right">
							<span className="text-[11px] font-medium text-slate-500">Progress</span>
							<p className="text-xs font-bold text-slate-900">
								{checkbox.length} of {seatarr.length} Assigned
							</p>
						</div>
					</div>

					{/* Passenger Selection List */}
					<div className="space-y-2">
						{MasterList.map((item, ind) => {
							const itemId = item.id || item._id;
							const isChecked = checkbox.includes(itemId);

							return (
								<div
									key={ind}
									onClick={() => handleCheckboxChange(itemId)}
									className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer select-none ${
										isChecked
											? "bg-blue-50/90 border-blue-500 ring-1 ring-blue-500 shadow-xs"
											: "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
									}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
												isChecked
													? "bg-blue-600 text-white"
													: "bg-slate-100 text-slate-700"
											}`}
										>
											{item.name ? item.name[0].toUpperCase() : ind + 1}
										</div>
										<div>
											<p className="text-sm font-bold text-slate-900">{item.name}</p>
											{item.email && (
												<p className="text-xs text-slate-500">{item.email}</p>
											)}
										</div>
									</div>

									{/* Common Checkbox */}
									<Checkbox
										checked={isChecked}
										onChange={() => handleCheckboxChange(itemId)}
										size="md"
										variant="blue"
										id={`passenger-cb-${itemId}`}
										aria-label={`Select ${item.name}`}
									/>
								</div>
							);
						})}
					</div>

					{/* Summary Card */}
					<div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-500">Total Payable</p>
							<p className="text-xl font-extrabold text-slate-900 tracking-tight">₹{pay}</p>
						</div>
						<div className="text-right">
							<span
								className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
									allAssigned
										? "bg-emerald-100 text-emerald-800"
										: "bg-amber-100 text-amber-800"
								}`}
							>
								{allAssigned
									? "Ready to proceed"
									: `Assign ${seatarr.length - checkbox.length} more`}
							</span>
						</div>
					</div>
				</div>

				{/* Modal Footer */}
				<div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
					<button
						type="button"
						onClick={() => setModalOpen(false)}
						className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
					>
						Back
					</button>
					<button
						type="button"
						onClick={goToPayment}
						disabled={!allAssigned || isSeatLocking}
						className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
					>
						{isSeatLocking ? (
							<>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Locking Seats...</span>
							</>
						) : (
							<>
								<span>Proceed to Checkout</span>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PassengerModal;
