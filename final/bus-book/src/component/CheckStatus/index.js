import React from "react";
import { useCheckStatus } from "./useCheckStatus";
import ShowPreviousHistory from "./ShowPreviousHistory";
import TicketResultCard from "./TicketResultCard";

const CheckStatus = () => {
	const {
		idNumber,
		setIdNumber,
		data,
		loading,
		searchHistory,
		submit,
		deletePreviousHistory,
		onClickSearchHistory,
	} = useCheckStatus();

	return (
		<div className="min-h-[calc(100vh-64px)] bg-slate-50/60 pb-16">
			{/* Top Hero Section */}
			<div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50 relative overflow-hidden">
				{/* Background Glow */}
				<div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

				<div className="max-w-3xl mx-auto text-center relative z-10">
					<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20 text-xs font-bold uppercase tracking-wider mb-4">
						<span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
						Real-Time PNR Verification
					</div>
					<h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
						Track Your Bus Ticket Status
					</h1>
					<p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
						Enter your 7-digit PNR number or numeric booking reference ID to view real-time journey details, seat reservations, and boarding pass.
					</p>
				</div>
			</div>

			{/* Main Search Card Container */}
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
				{/* Search Panel Card - Shadow removed for clean modern border styling */}
				<div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
					<label htmlFor="pnr-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
						Enter PNR Number or Booking Reference ID
					</label>

					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
								</svg>
							</div>
							<input
								id="pnr-input"
								type="text"
								value={idNumber}
								onChange={(e) => setIdNumber(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && submit()}
								className="w-full pl-11 pr-10 py-3.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-2xl font-mono text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
								placeholder="e.g. 5829104 or Booking #102"
								spellCheck={false}
							/>
							{idNumber && (
								<button
									type="button"
									onClick={() => setIdNumber("")}
									className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
									title="Clear input"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							)}
						</div>

						<button
							type="button"
							onClick={submit}
							disabled={loading || !idNumber.trim()}
							className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 flex-shrink-0"
						>
							{loading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									<span>Verifying...</span>
								</>
							) : (
								<>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<span>Check Status</span>
								</>
							)}
						</button>
					</div>

					{/* Format Hints & Instructions */}
					<div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
						<span className="font-semibold text-slate-700">Supported Formats:</span>
						<span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px]">
							7-digit PNR (e.g. 5829104)
						</span>
						<span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px]">
							Booking ID (e.g. 102)
						</span>
					</div>

					{/* Previous Search History */}
					<ShowPreviousHistory
						searchHistory={searchHistory}
						deletePreviousHistory={deletePreviousHistory}
						onClickSearchHistory={onClickSearchHistory}
						className="mt-5 pt-4 border-t border-slate-100"
					/>
				</div>

				{/* Loading Skeleton */}
				{loading && (
					<div className="mt-8 bg-white border border-slate-200 rounded-3xl p-8 animate-pulse space-y-4">
						<div className="h-6 bg-slate-200 rounded-lg w-1/3" />
						<div className="h-4 bg-slate-100 rounded-lg w-2/3" />
						<div className="grid grid-cols-3 gap-4 pt-4">
							<div className="h-12 bg-slate-100 rounded-xl" />
							<div className="h-12 bg-slate-100 rounded-xl" />
							<div className="h-12 bg-slate-100 rounded-xl" />
						</div>
					</div>
				)}

				{/* Ticket Details Result View */}
				{!loading && data && <TicketResultCard data={data} />}
			</div>
		</div>
	);
};

export default CheckStatus;
