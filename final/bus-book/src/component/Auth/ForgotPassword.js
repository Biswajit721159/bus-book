import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, useWatch } from "react-hook-form";
import { forgotPassword, resetPassword } from "../../apis/auth";
import OtpForm from "./OtpForm";
import AuthInput from "./AuthInput";
import PasswordValidationGrid, { validatePasswordAll } from "./PasswordValidationGrid";

const ForgotPassword = () => {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, touchedFields },
		control,
	} = useForm({
		mode: "onBlur",
	});

	const emailValue = useWatch({ control, name: "email", defaultValue: "" });
	const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
	const confirmValue = useWatch({ control, name: "confirmPassword", defaultValue: "" });

	const [step, setStep] = useState(1); // 1=form, 2=otp
	const [otp, setOtp] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [sendingOtp, setSendingOtp] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [resendTimeout, setResendTimeout] = useState(0);

	useEffect(() => {
		const auth = localStorage.getItem("user");
		if (auth) navigate("/");
	}, [navigate]);

	useEffect(() => {
		if (resendTimeout > 0) {
			const t = setTimeout(() => setResendTimeout((v) => v - 1), 1000);
			return () => clearTimeout(t);
		}
	}, [resendTimeout]);

	const pwdAllValid = validatePasswordAll(passwordValue);

	const handleSendOtp = async (data) => {
		if (!pwdAllValid) return;
		try {
			setSendingOtp(true);
			setErrorMsg("");
			await forgotPassword({ email: data.email });
			setSendingOtp(false);
			setStep(2);
			setResendTimeout(30);
			toast.success("OTP sent to your email");
		} catch (error) {
			setSendingOtp(false);
			setErrorMsg(error.message || "Something went wrong. Please try again.");
		}
	};

	const handleResend = async () => {
		if (resendTimeout > 0) return;
		try {
			setSendingOtp(true);
			setErrorMsg("");
			await forgotPassword({ email: emailValue });
			setSendingOtp(false);
			setResendTimeout(30);
			toast.success("OTP resent successfully!");
		} catch (error) {
			setSendingOtp(false);
			setErrorMsg(error.message || "Something went wrong. Please try again.");
		}
	};

	const handleVerifyOtp = async (e) => {
		e?.preventDefault();
		if (!otp) {
			setErrorMsg("Please enter the OTP");
			return;
		}
		try {
			setVerifyingOtp(true);
			setErrorMsg("");
			await resetPassword({ email: emailValue, otp, password: passwordValue });
			setVerifyingOtp(false);
			toast.success("Password reset successfully!");
			navigate("/login");
		} catch (error) {
			setVerifyingOtp(false);
			setErrorMsg(error.message || "Something went wrong. Please try again.");
		}
	};

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-surface-50">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
						<svg
							className="w-7 h-7 text-primary-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							/>
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-surface-900">Reset Password</h1>
					<p className="text-surface-500 text-sm mt-1">
						{step === 1
							? "Enter your details to reset your password"
							: "Enter the OTP sent to your email"}
					</p>
				</div>

				{/* Step indicator */}
				<div className="flex items-center justify-center gap-3 mb-6">
					{[1, 2].map((s) => (
						<React.Fragment key={s}>
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${step >= s ? "bg-primary-600 text-white" : "bg-surface-200 text-surface-500"}`}
							>
								{step > s ? (
									<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									s
								)}
							</div>
							{s < 2 && (
								<div
									className={`flex-1 h-0.5 max-w-[60px] ${step > s ? "bg-primary-600" : "bg-surface-200"}`}
								/>
							)}
						</React.Fragment>
					))}
				</div>

				<div className="card p-8">
					{step === 1 ? (
						<form onSubmit={handleSubmit(handleSendOtp)} className="space-y-5">
							{/* Email */}
							<AuthInput
								label="Email address"
								type="email"
								placeholder="you@example.com"
								disabled={sendingOtp}
								error={errors.email}
								success={touchedFields.email && emailValue && !errors.email}
								registration={register("email", {
									required: "Email is required",
									pattern: {
										value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
										message: "Please enter a valid email address",
									},
								})}
							/>

							{/* New Password */}
							<div>
								<AuthInput
									label="New Password"
									type="password"
									placeholder="Create a strong password"
									disabled={sendingOtp}
									error={errors.password}
									showPasswordToggle={true}
									success={touchedFields.password && pwdAllValid}
									registration={register("password", { required: true })}
								/>
								{touchedFields.password && passwordValue && !pwdAllValid && (
									<PasswordValidationGrid passwordValue={passwordValue} />
								)}
							</div>

							{/* Confirm Password */}
							<AuthInput
								label="Confirm Password"
								type="password"
								placeholder="Repeat your password"
								disabled={sendingOtp}
								error={errors.confirmPassword}
								showPasswordToggle={true}
								success={touchedFields.confirmPassword && confirmValue && !errors.confirmPassword}
								registration={register("confirmPassword", {
									required: true,
									validate: (value) => value === passwordValue || "Passwords do not match",
								})}
							/>

							{errorMsg && (
								<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
									<svg
										className="w-4 h-4 flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
									{errorMsg}
								</div>
							)}

							<button type="submit" disabled={sendingOtp} className="btn-primary w-full py-2.5">
								{sendingOtp ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Sending OTP...
									</>
								) : (
									"Send OTP"
								)}
							</button>
						</form>
					) : (
						<OtpForm
							email={emailValue}
							otp={otp}
							setOtp={setOtp}
							errorMsg={errorMsg}
							setErrorMsg={setErrorMsg}
							isVerifying={verifyingOtp}
							isResending={sendingOtp}
							onVerify={handleVerifyOtp}
							onResend={handleResend}
							resendTimeout={resendTimeout}
							onBack={() => {
								setStep(1);
								setErrorMsg("");
							}}
							submitText="Reset Password"
						/>
					)}

					<p className="text-center text-sm text-surface-500 mt-6">
						Remember your password?{" "}
						<Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
