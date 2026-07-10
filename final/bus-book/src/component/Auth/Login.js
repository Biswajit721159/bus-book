import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usermethod } from "../../redux/UserSlice";
import { login, loginverify, resentOtp, googleLogin } from "../../apis/auth";
import { useForm, useWatch } from "react-hook-form";
import OtpForm from "./OtpForm";
import AuthInput from "./AuthInput";
import PasswordValidationGrid, { validatePasswordAll } from "./PasswordValidationGrid";
import Loader from "../Loader";

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		mode: "onBlur",
	});

	const emailValue = useWatch({ control, name: "email", defaultValue: "" });
	const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

	const [errorMsg, setErrorMsg] = useState("");
	const [sendingOtp, setSendingOtp] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [isGoogleVerifying, setIsGoogleVerifying] = useState(false);
	const [step, setStep] = useState(1);
	const [otp, setOtp] = useState("");
	const [resendTimeout, setResendTimeout] = useState(0);

	useEffect(() => {
		const auth = JSON.parse(localStorage.getItem("user"));
		if (auth) navigate("/");
	}, [navigate]);

	useEffect(() => {
		if (resendTimeout > 0) {
			const t = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
			return () => clearTimeout(t);
		}
	}, [resendTimeout]);

	const handleGoogleLoginSuccess = useCallback(async (response) => {
		const idToken = response.credential;
		try {
			setIsGoogleVerifying(true);
			setErrorMsg("");
			const result = await googleLogin({ token: idToken });
			setIsGoogleVerifying(false);
			dispatch(usermethod.Add_User(result.data));
			const from = location.state?.from?.pathname || "/book-bus";
			navigate(from, { replace: true });
		} catch (error) {
			setIsGoogleVerifying(false);
			setErrorMsg(error?.message || "Google Sign-In failed. Please try again.");
		}
	}, [dispatch, location, navigate]);

	useEffect(() => {
		/* global google */
		if (window.google) {
			google.accounts.id.initialize({
				client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
				callback: handleGoogleLoginSuccess,
			});
			google.accounts.id.renderButton(
				document.getElementById("googleSignInDiv"),
				{ theme: "outline", size: "large", width: "100%" }
			);
		}
	}, [step, handleGoogleLoginSuccess]);

	const allPwdValid = validatePasswordAll(passwordValue);

	const handleSendOtp = async (data) => {
		if (!allPwdValid) return;
		try {
			setSendingOtp(true);
			setErrorMsg("");
			await login({ email: data.email, password: data.password });
			setSendingOtp(false);
			setStep(2);
			setResendTimeout(30);
		} catch (error) {
			setSendingOtp(false);
			setErrorMsg(error?.message || "Something went wrong. Please try again.");
		}
	};

	const handleVerifyOtp = async (e) => {
		e?.preventDefault();
		if (otp.length !== 6) {
			setErrorMsg("OTP must be 6 digits");
			return;
		}
		try {
			setVerifyingOtp(true);
			setErrorMsg("");
			const result = await loginverify({ email: emailValue, otp, password: passwordValue });
			setVerifyingOtp(false);
			dispatch(usermethod.Add_User(result.data));
			const from = location.state?.from?.pathname || "/book-bus";
			navigate(from, { replace: true });
		} catch (error) {
			setVerifyingOtp(false);
			setErrorMsg(error?.message || "Something went wrong. Please try again.");
		}
	};

	const handleResend = async () => {
		if (resendTimeout > 0) return;
		try {
			setSendingOtp(true);
			setErrorMsg("");
			await resentOtp({ email: emailValue });
			setSendingOtp(false);
			setResendTimeout(30);
		} catch (error) {
			setSendingOtp(false);
			setErrorMsg(error?.message || "Something went wrong. Please try again.");
		}
	};

	return (
		<>
			{isGoogleVerifying && <Loader text="Verifying Google account..." />}
			<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-surface-50">
			<div className="w-full max-w-md">
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
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
					<p className="text-surface-500 text-sm mt-1">Sign in to your BlueBus account</p>
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
								success={emailValue && !errors.email}
								registration={register("email", {
									required: "Email is required",
									pattern: {
										value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
										message: "Please enter a valid email address",
									},
								})}
							/>

							{/* Password */}
							<div>
								<div className="flex items-center justify-between mb-1.5">
									<label className="label mb-0">Password</label>
									<Link
										to="/forgot-password"
										className="text-xs text-primary-600 hover:text-primary-700 font-medium"
									>
										Forgot password?
									</Link>
								</div>
								<AuthInput
									type="password"
									placeholder="Enter your password"
									disabled={sendingOtp}
									error={errors.password}
									showPasswordToggle={true}
									registration={register("password", { required: true })}
								/>
								<PasswordValidationGrid passwordValue={passwordValue} />
							</div>

							{/* Error */}
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
									"Sign In"
								)}
							</button>

							<div className="relative flex py-2 items-center">
								<div className="flex-grow border-t border-surface-200"></div>
								<span className="flex-shrink mx-4 text-surface-400 text-xs uppercase">Or continue with</span>
								<div className="flex-grow border-t border-surface-200"></div>
							</div>

							<div id="googleSignInDiv" className="w-full flex justify-center mt-2"></div>
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
						/>
					)}

					<p className="text-center text-sm text-surface-500 mt-6">
						Don't have an account?{" "}
						<Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
		</>
	);
}
