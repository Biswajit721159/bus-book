import React from "react";
import Loader from "../Loader";

import PaymentSummary from "./PaymentSummary";
import CardPaymentForm from "./CardPaymentForm";
import UpiPaymentForm from "./UpiPaymentForm";
import NetBankingPaymentForm from "./NetBankingPaymentForm";
import { usePayment } from "./usePayment";

const Payment = () => {
	const {
		navigate,
		src,
		dist,
		date,
		seat_record,
		person,
		total_money,
		totalDistance,
		activeTab,
		setActiveTab,
		submitload,
		cardNumber,
		cardName,
		setCardName,
		cardExpiry,
		cardCvv,
		isCvvFocused,
		setIsCvvFocused,
		upiId,
		setUpiId,
		selectedBank,
		setSelectedBank,
		handleCardNumberChange,
		handleExpiryChange,
		handleCvvChange,
		handlePaymentSubmit,
	} = usePayment();

	if (submitload) return <Loader text="Processing your secure payment..." />;

	return (
		<div className="min-h-[calc(100vh-64px)] bg-surface-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Page Header */}
				<div className="mb-6">
					<button
						onClick={() => navigate(-1)}
						className="btn-ghost text-sm mb-4 inline-flex items-center gap-1"
					>
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to Seat Selection
					</button>
					<h1 className="text-2xl font-bold text-surface-900">Secure Payment</h1>
					<p className="text-sm text-surface-500 mt-1">
						Complete your transaction to confirm your seats
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					{/* Left: Payment Form */}
					<div className="lg:col-span-3 space-y-6">
						<div className="card p-6">
							{/* Tab Selection */}
							<div className="flex border-b border-surface-200 mb-6">
								<button
									onClick={() => setActiveTab("card")}
									className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-150 ${
										activeTab === "card"
											? "border-primary-600 text-primary-600"
											: "border-transparent text-surface-500 hover:text-surface-800"
									}`}
								>
									Credit/Debit Card
								</button>
								<button
									onClick={() => setActiveTab("upi")}
									className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-150 ${
										activeTab === "upi"
											? "border-primary-600 text-primary-600"
											: "border-transparent text-surface-500 hover:text-surface-800"
									}`}
								>
									UPI
								</button>
								<button
									onClick={() => setActiveTab("netbanking")}
									className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-150 ${
										activeTab === "netbanking"
											? "border-primary-600 text-primary-600"
											: "border-transparent text-surface-500 hover:text-surface-800"
									}`}
								>
									Net Banking
								</button>
							</div>

							<form onSubmit={handlePaymentSubmit}>
								{activeTab === "card" && (
									<CardPaymentForm
										cardNumber={cardNumber}
										handleCardNumberChange={handleCardNumberChange}
										cardName={cardName}
										setCardName={setCardName}
										cardExpiry={cardExpiry}
										handleExpiryChange={handleExpiryChange}
										cardCvv={cardCvv}
										handleCvvChange={handleCvvChange}
										isCvvFocused={isCvvFocused}
										setIsCvvFocused={setIsCvvFocused}
									/>
								)}

								{activeTab === "upi" && <UpiPaymentForm upiId={upiId} setUpiId={setUpiId} />}

								{activeTab === "netbanking" && (
									<NetBankingPaymentForm
										selectedBank={selectedBank}
										setSelectedBank={setSelectedBank}
									/>
								)}

								{/* Submit Button */}
								<button
									type="submit"
									className="btn-primary w-full mt-6 py-2 text-sm shadow-lg shadow-primary-600/10"
								>
									Pay ₹{total_money} & Confirm Booking
								</button>
							</form>
						</div>
					</div>

					{/* Right: Booking Summary Info Panel */}
					<div className="lg:col-span-2">
						<PaymentSummary
							src={src}
							dist={dist}
							date={date}
							totalDistance={totalDistance}
							seat_record={seat_record}
							person={person}
							total_money={total_money}
						/>
					</div>
				</div>
			</div>

			{/* Rotate Credit Card styling helper */}
			<style>{`
				.rotate-y-180 {
					transform: rotateY(180deg);
				}
				.backface-hidden {
					backface-visibility: hidden;
					-webkit-backface-visibility: hidden;
				}
				.preserve-3d {
					transform-style: preserve-3d;
				}
			`}</style>
		</div>
	);
};

export default Payment;
