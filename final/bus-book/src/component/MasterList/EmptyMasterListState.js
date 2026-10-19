import React from "react";

const EmptyMasterListState = ({ onAddClick }) => {
	return (
		<div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center">
			{/* Icon Badge */}
			<div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-50 to-indigo-100/70 border border-blue-200/60 text-blue-600 flex items-center justify-center mb-6 shadow-xs">
				<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			</div>

			<h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
				No Saved Passengers Yet
			</h3>
			<p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
				Save the names of your family, friends, or co-travelers now for instant 1-click autofill during seat booking and ticket checkout!
			</p>

			{/* Benefits Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-8 max-w-2xl w-full text-left">
				<div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
					<div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-2.5">
						⚡
					</div>
					<h4 className="text-xs font-bold text-slate-900">1-Click Booking</h4>
					<p className="text-[11px] text-slate-500 mt-0.5">
						Skip typing names during seat reservation.
					</p>
				</div>

				<div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
					<div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2.5">
						👥
					</div>
					<h4 className="text-xs font-bold text-slate-900">Family & Friends</h4>
					<p className="text-[11px] text-slate-500 mt-0.5">
						Keep frequent co-passengers ready in one place.
					</p>
				</div>

				<div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
					<div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-2.5">
						🔒
					</div>
					<h4 className="text-xs font-bold text-slate-900">Secure & Private</h4>
					<p className="text-[11px] text-slate-500 mt-0.5">
						Safely stored and encrypted on your account.
					</p>
				</div>
			</div>

			<button
				type="button"
				onClick={onAddClick}
				className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-150 hover:scale-[1.02]"
			>
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
				</svg>
				<span>Add First Passenger</span>
			</button>
		</div>
	);
};

export default EmptyMasterListState;
