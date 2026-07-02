import React from "react";

const UpiPaymentForm = ({ upiId, setUpiId }) => {
	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center justify-center p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
				{/* Mock UPI QR Code */}
				<div className="w-36 h-36 bg-white p-3 rounded-xl shadow-md flex items-center justify-center relative overflow-hidden border border-surface-200">
					<div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-80">
						{[...Array(25)].map((_, i) => (
							<div
								key={i}
								className={`rounded-sm ${
									(i % 3 === 0 || i % 4 === 0) && i !== 12 ? "bg-slate-900" : "bg-transparent"
								}`}
							/>
						))}
					</div>
					{/* Scanner animation overlay */}
					<div className="absolute left-0 right-0 h-0.5 bg-primary-500 top-0 animate-bounce" />
				</div>
				<p className="text-xs text-surface-500 mt-3 text-center">
					Scan QR Code to pay or enter your UPI ID below
				</p>
			</div>

			<div>
				<label className="label">UPI ID / VPA</label>
				<input
					type="text"
					placeholder="username@bank"
					value={upiId}
					onChange={(e) => setUpiId(e.target.value)}
					className="input-field font-medium"
					required
				/>
			</div>
		</div>
	);
};

export default UpiPaymentForm;
