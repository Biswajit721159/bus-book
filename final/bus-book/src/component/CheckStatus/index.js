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
		<div className="min-h-[calc(100vh-64px)] bg-surface-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4 text-primary-600 shadow-sm border border-primary-200">
						<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-surface-900">Check Ticket Status</h1>
					<p className="text-surface-500 text-sm mt-2">Enter your booking ID to check the status of your ticket</p>
				</div>

				{/* Search Panel Card */}
				<div className="card p-6 mb-6 bg-white shadow-sm border border-surface-200 rounded-2xl">
					<label className="label font-semibold text-sm text-surface-700 mb-1.5 block">Booking ID</label>
					<div className="flex gap-3">
						<input
							type="text"
							value={idNumber}
							onChange={(e) => setIdNumber(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && submit()}
							className="input-field flex-1 font-mono text-sm pr-4 shadow-inner"
							placeholder="Enter your booking ID (e.g. 642df5...)"
							spellCheck={false}
						/>
						<button
							onClick={submit}
							disabled={loading}
							className="btn-primary px-6 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm hover:bg-primary-700 transition-colors"
						>
							{loading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Checking...
								</>
							) : (
								<>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									Check
								</>
							)}
						</button>
					</div>
				</div>

				{/* Previous Search History */}
				<ShowPreviousHistory
					searchHistory={searchHistory}
					deletePreviousHistory={deletePreviousHistory}
					onClickSearchHistory={onClickSearchHistory}
				/>

				{/* Ticket Details Result View */}
				{data && <TicketResultCard data={data} />}
			</div>
		</div>
	);
};

export default CheckStatus;
