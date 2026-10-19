import React from "react";

/**
 * Modern, reusable, highly styled Checkbox component
 *
 * @param {boolean} checked - Current checked status
 * @param {Function} onChange - Change handler (passes event, or can be called directly)
 * @param {boolean} disabled - Whether the checkbox is disabled
 * @param {string|React.ReactNode} label - Primary label text
 * @param {string|React.ReactNode} description - Optional secondary descriptive text
 * @param {string|number|React.ReactNode} badge - Optional badge tag (e.g., count or tag)
 * @param {"blue"|"rose"|"emerald"|"indigo"} variant - Color theme accent
 * @param {"sm"|"md"|"lg"} size - Size of the checkbox
 * @param {string} className - Wrapper container class name
 * @param {string} id - HTML id for label pairing
 */
const Checkbox = ({
	checked = false,
	onChange = () => {},
	disabled = false,
	label,
	description,
	badge,
	variant = "blue",
	size = "md",
	className = "",
	id,
	...rest
}) => {
	const generatedId = id || (label ? `cb-${label.toString().toLowerCase().replace(/\s+/g, "-")}` : undefined);

	// Size configurations
	const sizeStyles = {
		sm: {
			box: "w-4 h-4 rounded-md",
			icon: "w-2.5 h-2.5",
			label: "text-xs",
			desc: "text-[11px]",
			gap: "gap-2",
		},
		md: {
			box: "w-5 h-5 rounded-lg",
			icon: "w-3.5 h-3.5",
			label: "text-xs sm:text-sm",
			desc: "text-xs",
			gap: "gap-2.5",
		},
		lg: {
			box: "w-6 h-6 rounded-xl",
			icon: "w-4 h-4",
			label: "text-sm sm:text-base",
			desc: "text-xs",
			gap: "gap-3",
		},
	};

	// Variant color configurations
	const variantStyles = {
		blue: {
			checked: "bg-blue-600 border-blue-600 text-white shadow-xs shadow-blue-500/30",
			hover: "hover:border-blue-400 group-hover:border-blue-500",
			ring: "focus-visible:ring-blue-500",
			badge: "bg-blue-50 text-blue-700 border-blue-200",
		},
		rose: {
			checked: "bg-rose-500 border-rose-500 text-white shadow-xs shadow-rose-500/30",
			hover: "hover:border-rose-400 group-hover:border-rose-500",
			ring: "focus-visible:ring-rose-500",
			badge: "bg-rose-50 text-rose-700 border-rose-200",
		},
		emerald: {
			checked: "bg-emerald-600 border-emerald-600 text-white shadow-xs shadow-emerald-500/30",
			hover: "hover:border-emerald-400 group-hover:border-emerald-500",
			ring: "focus-visible:ring-emerald-500",
			badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
		},
		indigo: {
			checked: "bg-indigo-600 border-indigo-600 text-white shadow-xs shadow-indigo-500/30",
			hover: "hover:border-indigo-400 group-hover:border-indigo-500",
			ring: "focus-visible:ring-indigo-500",
			badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
		},
	};

	const currentSize = sizeStyles[size] || sizeStyles.md;
	const currentVariant = variantStyles[variant] || variantStyles.blue;

	const handleChange = (e) => {
		if (disabled) return;
		onChange(e);
	};

	return (
		<label
			htmlFor={generatedId}
			className={`inline-flex items-center ${currentSize.gap} select-none cursor-pointer group ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			} ${className}`}
		>
			<div className="relative flex items-center justify-center flex-shrink-0">
				{/* Hidden accessible native input */}
				<input
					type="checkbox"
					id={generatedId}
					checked={checked}
					onChange={handleChange}
					disabled={disabled}
					className="sr-only peer"
					{...rest}
				/>

				{/* Visual stylized box */}
				<div
					className={`
						${currentSize.box}
						flex items-center justify-center
						border-2 transition-all duration-200 ease-out
						peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${currentVariant.ring}
						${
							checked
								? currentVariant.checked
								: `bg-white border-slate-300 ${!disabled ? currentVariant.hover : ""}`
						}
					`}
				>
					{/* Animated checkmark icon */}
					<svg
						className={`
							${currentSize.icon}
							stroke-current stroke-[3] fill-none
							transition-all duration-200 transform
							${checked ? "scale-100 opacity-100" : "scale-50 opacity-0"}
						`}
						viewBox="0 0 24 24"
					>
						<polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
			</div>

			{/* Label & Description */}
			{(label || description || badge !== undefined) && (
				<div className="flex flex-col">
					<div className="flex items-center gap-2">
						{label && (
							<span
								className={`${currentSize.label} font-bold text-slate-800 transition-colors ${
									!disabled && "group-hover:text-slate-900"
								}`}
							>
								{label}
							</span>
						)}
						{badge !== undefined && (
							<span
								className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${currentVariant.badge}`}
							>
								{badge}
							</span>
						)}
					</div>
					{description && (
						<span className={`${currentSize.desc} text-slate-500 font-normal leading-tight mt-0.5`}>
							{description}
						</span>
					)}
				</div>
			)}
		</label>
	);
};

export default Checkbox;
