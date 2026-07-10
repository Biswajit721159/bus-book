import React from "react";

const NetBankingPaymentForm = ({ selectedBank, setSelectedBank }) => {
	const popularBanks = [
		{ id: "sbi", name: "State Bank of India", logo: "🏛️" },
		{ id: "hdfc", name: "HDFC Bank", logo: "🏦" },
		{ id: "icici", name: "ICICI Bank", logo: "💳" },
		{ id: "axis", name: "Axis Bank", logo: "🪙" },
	];

	return (
		<div className="space-y-4">
			<label className="label">Select Your Bank</label>
			<div className="grid grid-cols-2 gap-3 mb-4">
				{popularBanks.map((bank) => (
					<button
						type="button"
						key={bank.id}
						onClick={() => setSelectedBank(bank.id)}
						className={`flex items-center gap-3 p-3.5 border-2 rounded-xl text-left transition-all duration-150 ${
							selectedBank === bank.id
								? "border-primary-500 bg-primary-50/50"
								: "border-surface-200 hover:border-surface-300 hover:bg-surface-50"
						}`}
					>
						<span className="text-lg">{bank.logo}</span>
						<span className="text-xs font-semibold text-surface-800">{bank.name}</span>
					</button>
				))}
			</div>

			<select
				value={selectedBank}
				onChange={(e) => setSelectedBank(e.target.value)}
				className="input-field font-medium"
				required
			>
				<option value="">-- Or Choose Other Bank --</option>
				<option value="pnb">Punjab National Bank</option>
				<option value="bob">Bank of Baroda</option>
				<option value="canara">Canara Bank</option>
				<option value="yes">Yes Bank</option>
			</select>
		</div>
	);
};

export default NetBankingPaymentForm;
