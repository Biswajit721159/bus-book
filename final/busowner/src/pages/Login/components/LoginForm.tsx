import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../../lib/validationSchemas";
import InputField from "../../../components/forms/InputField";
import PasswordToggle from "../../../components/forms/PasswordToggle";
import SubmitButton from "../../../components/forms/SubmitButton";

interface LoginFormProps {
	onSubmit: (data: LoginFormData) => Promise<void>;
	isLoading: boolean;
	onGoogleLogin: (credential: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, onGoogleLogin }) => {
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { rememberMe: false },
	});

	// Init Google Sign-In button
	useEffect(() => {
		const win = window as any;
		if (win.google) {
			win.google.accounts.id.initialize({
				client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
				callback: (resp: any) => onGoogleLogin(resp.credential),
			});
			win.google.accounts.id.renderButton(document.getElementById("googleSignInDiv"), {
				theme: "outline",
				size: "large",
				width: "100%",
				shape: "rectangular",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in" noValidate>
			<InputField
				id="login-email"
				type="email"
				label="Email Address"
				placeholder="operator@company.com"
				autoComplete="email"
				icon={
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
					</svg>
				}
				error={errors.email?.message}
				{...register("email")}
			/>

			<InputField
				id="login-password"
				type={showPassword ? "text" : "password"}
				label="Password"
				placeholder="Enter your account password"
				autoComplete="current-password"
				icon={
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				}
				error={errors.password?.message}
				rightElement={
					<PasswordToggle show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
				}
				{...register("password")}
			/>

			<div className="flex items-center justify-between pt-1">
				<label className="flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
						{...register("rememberMe")}
					/>
					<span className="text-xs font-semibold text-slate-600">Remember me</span>
				</label>
				<Link
					to="/ForgotPassword"
					className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
				>
					Forgot password?
				</Link>
			</div>

			<SubmitButton isLoading={isLoading} label="Sign In to Dashboard" loadingLabel="Verifying credentials..." />

			{/* Google Sign-In divider */}
			<div className="relative my-4">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-slate-200" />
				</div>
				<div className="relative flex justify-center text-xs">
					<span className="px-3 bg-white text-slate-400 font-bold uppercase tracking-wider">
						Or continue with
					</span>
				</div>
			</div>

			<div className="flex justify-center">
				<div id="googleSignInDiv" className="w-full" />
			</div>
		</form>
	);
};

export default LoginForm;
