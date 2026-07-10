import React from "react";

const OtpForm = ({
	email,
	otp,
	setOtp,
	errorMsg,
	setErrorMsg,
	isVerifying,
	isResending,
	onVerify,
	onResend,
	resendTimeout,
	onBack,
	submitText = "Verify & Sign In",
}) => {
	const isDisabled = isVerifying || isResending;

	return (
		<div className="space-y-5">
			<div className="text-center">
				<div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-2xl mb-3">
					<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<p className="text-sm text-surface-600">We sent a 6-digit OTP to</p>
				<p className="font-semibold text-surface-900">{email}</p>
			</div>

			<form onSubmit={onVerify} className="space-y-4">
				<div>
					<label className="label">Enter OTP</label>
					<input
						type="number"
						value={otp}
						onChange={(e) => {
							setOtp(e.target.value);
							if (setErrorMsg) setErrorMsg("");
						}}
						className="input-field text-center text-2xl font-bold tracking-widest"
						placeholder="000000"
						maxLength={6}
					/>
				</div>

				{errorMsg && (
					<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
						<svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
						{errorMsg}
					</div>
				)}

				<button
					type="submit"
					disabled={isDisabled}
					className="btn-primary w-full py-2.5"
				>
					{isVerifying ? (
						<>
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Verifying...
						</>
					) : (
						submitText
					)}
				</button>

				<div className="text-center text-sm text-surface-500">
					{resendTimeout > 0 ? (
						<span>
							Resend OTP in <strong className="text-surface-700">{resendTimeout}s</strong>
						</span>
					) : (
						<button
							type="button"
							onClick={onResend}
							disabled={isDisabled}
							className="text-primary-600 font-medium hover:text-primary-700"
						>
							{isResending ? "Resending..." : "Resend OTP"}
						</button>
					)}
				</div>
			</form>

			<button
				onClick={onBack}
				className="btn-ghost w-full text-surface-500"
			>
				← Back to form
			</button>
		</div>
	);
};

export default OtpForm;
