import React from "react";

const CardPaymentForm = ({
	cardNumber,
	handleCardNumberChange,
	cardName,
	setCardName,
	cardExpiry,
	handleExpiryChange,
	cardCvv,
	handleCvvChange,
	isCvvFocused,
	setIsCvvFocused,
}) => {
	// Auto-detect card brand based on first digit
	const firstDigit = cardNumber?.charAt(0);
	const cardBrand =
		firstDigit === "4"
			? "Visa"
			: firstDigit === "5"
				? "Mastercard"
				: firstDigit === "6"
					? "RuPay"
					: firstDigit === "3"
						? "Amex"
						: "Card";

	return (
		<div className="space-y-5">
			{/* Interactive 3D Card Mockup */}
			<div className="flex justify-center mb-6">
				<div
					className={`relative w-80 h-48 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-5 shadow-2xl transition-all duration-500 transform ${
						isCvvFocused ? "rotate-y-180" : ""
					} preserve-3d border border-slate-700/50`}
					style={{ perspective: "1000px" }}
				>
					{/* Card Front */}
					<div
						className={`absolute inset-0 p-4 flex flex-col justify-between backface-hidden ${
							isCvvFocused ? "opacity-0" : "opacity-100"
						}`}
					>
						<div className="flex justify-between items-center">
							{/* EMV Microchip Representation */}
							<div className="w-10 h-7 bg-amber-400/90 rounded-md flex items-center justify-center shadow-xs">
								<div className="w-8 h-5 border border-amber-600/30 rounded-xs grid grid-cols-3 gap-0.5 p-0.5">
									{[...Array(6)].map((_, i) => (
										<div key={i} className="border border-amber-700/20 bg-amber-300/60 rounded-2xs" />
									))}
								</div>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-extrabold tracking-widest text-blue-300 uppercase">
									{cardBrand}
								</span>
								<div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
							</div>
						</div>

						{/* Masked Card Number */}
						<div className="text-xl font-mono font-bold tracking-widest text-center my-2 text-white drop-shadow-sm">
							{cardNumber || "•••• •••• •••• ••••"}
						</div>

						{/* Cardholder & Expiry */}
						<div className="flex justify-between items-end text-xs">
							<div className="min-w-0 flex-1 pr-2">
								<p className="text-[9px] uppercase tracking-wider text-blue-300 font-semibold">
									Cardholder Name
								</p>
								<p className="font-bold uppercase tracking-wider truncate text-slate-100">
									{cardName || "YOUR NAME"}
								</p>
							</div>
							<div className="text-right flex-shrink-0">
								<p className="text-[9px] uppercase tracking-wider text-blue-300 font-semibold">
									Expires
								</p>
								<p className="font-bold tracking-widest text-slate-100 font-mono">
									{cardExpiry || "MM/YY"}
								</p>
							</div>
						</div>
					</div>

					{/* Card Back (for CVV focus) */}
					<div
						className={`absolute inset-0 flex flex-col justify-between py-4 backface-hidden rotate-y-180 ${
							isCvvFocused ? "opacity-100" : "opacity-0"
						}`}
					>
						<div className="w-full h-9 bg-slate-950 mt-2 border-y border-slate-800" />
						<div className="px-5">
							<p className="text-[8px] text-right uppercase tracking-wider text-blue-300 mb-1 font-bold">
								Security CVV
							</p>
							<div className="w-full h-8 bg-white text-slate-900 flex items-center justify-end px-3 font-mono text-sm font-black tracking-widest rounded-md shadow-inner">
								{cardCvv || "•••"}
							</div>
						</div>
						<div className="px-5 text-[8px] text-blue-300/60 flex justify-between font-mono">
							<span>PCI-DSS SECURED</span>
							<span>AUTHORIZED SIGNATURE</span>
						</div>
					</div>
				</div>
			</div>

			{/* Input Fields */}
			<div className="space-y-4">
				<div>
					<label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
						Card Number
					</label>
					<div className="relative">
						<input
							type="text"
							placeholder="0000 0000 0000 0000"
							value={cardNumber}
							onChange={handleCardNumberChange}
							maxLength={19}
							className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							required
						/>
						<div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">
							{cardBrand}
						</div>
					</div>
				</div>

				<div>
					<label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
						Cardholder Name
					</label>
					<input
						type="text"
						placeholder="e.g. John Doe"
						value={cardName}
						onChange={(e) => setCardName(e.target.value.slice(0, 26))}
						className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-3.5">
					<div>
						<label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
							Expiry Date
						</label>
						<input
							type="text"
							placeholder="MM/YY"
							value={cardExpiry}
							onChange={handleExpiryChange}
							maxLength={5}
							className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							required
						/>
					</div>
					<div>
						<label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
							CVV / CVC
						</label>
						<input
							type="password"
							placeholder="•••"
							value={cardCvv}
							onChange={handleCvvChange}
							onFocus={() => setIsCvvFocused(true)}
							onBlur={() => setIsCvvFocused(false)}
							maxLength={4}
							className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							required
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardPaymentForm;
