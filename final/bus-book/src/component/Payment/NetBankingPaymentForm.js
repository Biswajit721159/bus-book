import React from "react";

const NetBankingPaymentForm = ({ selectedBank, setSelectedBank }) => {
	const popularBanks = [
		{ id: "sbi", name: "SBI", fullName: "State Bank of India", icon: "🏛️" },
		{ id: "hdfc", name: "HDFC Bank", fullName: "HDFC Bank Ltd", icon: "🏦" },
		{ id: "icici", name: "ICICI Bank", fullName: "ICICI Bank Ltd", icon: "💳" },
		{ id: "axis", name: "Axis Bank", fullName: "Axis Bank Ltd", icon: "🪙" },
		{ id: "kotak", name: "Kotak", fullName: "Kotak Mahindra Bank", icon: "🛡️" },
		{ id: "pnb", name: "PNB", fullName: "Punjab National Bank", icon: "🏢" },
	];

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
					Select Popular Bank
				</label>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
					{popularBanks.map((bank) => (
						<button
							type="button"
							key={bank.id}
							onClick={() => setSelectedBank(bank.id)}
							className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-150 ${
								selectedBank === bank.id
									? "border-blue-600 bg-blue-50/80 shadow-xs scale-102"
									: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
							}`}
						>
							<span className="text-xl mb-1">{bank.icon}</span>
							<span className="text-xs font-bold text-slate-800">{bank.name}</span>
						</button>
					))}
				</div>
			</div>

			<div>
				<label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
					Or Choose From All Banks
				</label>
				<select
					value={selectedBank}
					onChange={(e) => setSelectedBank(e.target.value)}
					className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
					required
				>
					<option value="">-- Select Any Other Indian Bank --</option>
					<option value="bob">Bank of Baroda</option>
					<option value="canara">Canara Bank</option>
					<option value="union">Union Bank of India</option>
					<option value="indusind">IndusInd Bank</option>
					<option value="yes">Yes Bank</option>
					<option value="idbi">IDBI Bank</option>
					<option value="federal">Federal Bank</option>
				</select>
			</div>
		</div>
	);
};

export default NetBankingPaymentForm;
