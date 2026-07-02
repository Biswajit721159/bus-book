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

  console.log("errors", errors);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-in" noValidate>
			<InputField
				id="login-email"
				type="email"
				label="Email address"
				placeholder="you@example.com"
				autoComplete="email"
				error={errors.email?.message}
				{...register("email")}
			/>

			<InputField
				id="login-password"
				type={showPassword ? "text" : "password"}
				label="Password"
				placeholder="Enter your password"
				autoComplete="current-password"
				error={errors.password?.message}
				rightElement={
					<PasswordToggle show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
				}
				{...register("password")}
			/>

			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
						{...register("rememberMe")}
					/>
					<span className="text-sm text-slate-600">Remember me</span>
				</label>
				<Link
					to="/ForgotPassword"
					className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
				>
					Forgot password?
				</Link>
			</div>

			<SubmitButton isLoading={isLoading} label="Sign In" loadingLabel="Signing in..." />

			{/* Google divider */}
			<div className="relative mt-4">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-slate-200" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-3 bg-white/80 text-slate-500 rounded-full">Or continue with</span>
				</div>
			</div>

			<div className="flex justify-center">
				<div id="googleSignInDiv" className="w-full" />
			</div>
		</form>
	);
};

export default LoginForm;
