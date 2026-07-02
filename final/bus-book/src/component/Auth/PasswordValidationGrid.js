import React from "react";
import ValidationItem from "./ValidationItem";

const PasswordValidationGrid = ({ passwordValue }) => {
	if (!passwordValue) return null;

	const validations = {
		upper: /[A-Z]/.test(passwordValue),
		lower: /[a-z]/.test(passwordValue),
		digit: /\d/.test(passwordValue),
		special: /[^\w\d]/.test(passwordValue),
		len: passwordValue.length >= 8 && passwordValue.length <= 15,
	};

	return (
		<div className="mt-2 p-3 bg-surface-50 rounded-lg grid grid-cols-2 gap-1">
			<ValidationItem valid={validations.upper} text="Uppercase letter" />
			<ValidationItem valid={validations.lower} text="Lowercase letter" />
			<ValidationItem valid={validations.digit} text="Number" />
			<ValidationItem valid={validations.special} text="Special character" />
			<ValidationItem valid={validations.len} text="8–15 characters" />
		</div>
	);
};

export const validatePasswordAll = (passwordValue) => {
	if (!passwordValue) return false;
	const validations = [
		/[A-Z]/.test(passwordValue),
		/[a-z]/.test(passwordValue),
		/\d/.test(passwordValue),
		/[^\w\d]/.test(passwordValue),
		passwordValue.length >= 8 && passwordValue.length <= 15,
	];
	return validations.every(Boolean);
};

export default PasswordValidationGrid;
