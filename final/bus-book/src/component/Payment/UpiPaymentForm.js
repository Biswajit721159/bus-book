import React from "react";

const UpiPaymentForm = ({ upiId, setUpiId }) => {
	const popularHandles = ["@okaxis", "@okhdfcbank", "@okicici", "@ybl", "@paytm"];

	const handleQuickSuffix = (suffix) => {
		const base = upiId.split("@")[0] || "username";
		setUpiId(`${base}${suffix}`);
	};

	return (
		<div className="space-y-6">
			{/* Scan QR Section */}
			<div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50/70 to-slate-50 rounded-2xl border border-blue-100/80">
				<div className="w-40 h-40 bg-white p-3.5 rounded-2xl shadow-md flex items-center justify-center relative overflow-hidden border border-slate-200">
					{/* Modern QR Grid Representation */}
					<div className="grid grid-cols-6 gap-1 w-full h-full opacity-85">
						{[...Array(36)].map((_, i) => (
							<div
								key={i}
								className={`rounded-xs ${
									(i % 2 === 0 || i % 5 === 0) && i !== 14 && i !== 21
										? "bg-slate-900"
										: "bg-transparent"
								}`}
							/>
						))}
					</div>
					{/* Scanning Laser Beam */}
					<div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent top-0 animate-bounce" />
				</div>

				<div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-700">
					<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
					<span>Scan & Pay with any UPI App</span>
				</div>
				<p className="text-[11px] text-slate-400 mt-0.5 text-center">
					Google Pay · PhonePe · Paytm · BHIM · CRED
				</p>
			</div>

			{/* UPI ID Input */}
			<div>
				<label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
					Or Enter UPI Virtual Address (VPA)
				</label>
				<div className="relative">
					<input
						type="text"
						placeholder="username@bank"
						value={upiId}
						onChange={(e) => setUpiId(e.target.value)}
						className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						required
					/>
				</div>

				{/* Quick Suffix Chips */}
				<div className="flex items-center gap-1.5 flex-wrap mt-2.5">
					<span className="text-[11px] font-semibold text-slate-400 mr-1">Popular:</span>
					{popularHandles.map((suffix) => (
						<button
							type="button"
							key={suffix}
							onClick={() => handleQuickSuffix(suffix)}
							className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-semibold border border-slate-200 transition-colors"
						>
							{suffix}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default UpiPaymentForm;
