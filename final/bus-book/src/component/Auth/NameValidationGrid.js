import React from "react";
import ValidationItem from "./ValidationItem";

const NameValidationGrid = ({ nameValue }) => {
	if (!nameValue) return null;

	const nameWords = nameValue.trim().split(/\s+/);
	const validations = {
		noNumber: !/\d/.test(nameValue),
		twoWords: nameWords.length >= 2,
		wordLen: nameWords.every((w) => w.length > 1),
		len: nameValue.length >= 6 && nameValue.length <= 20,
		noSpecial: /^[a-zA-Z ]+$/.test(nameValue),
	};

	return (
		<div className="mt-2 p-3 bg-surface-50 rounded-lg grid grid-cols-2 gap-1">
			<ValidationItem valid={validations.noNumber} text="No numbers" />
			<ValidationItem valid={validations.twoWords} text="At least 2 words" />
			<ValidationItem valid={validations.wordLen} text="Each word > 1 char" />
			<ValidationItem valid={validations.len} text="6–20 characters" />
			<ValidationItem valid={validations.noSpecial} text="No special chars" />
		</div>
	);
};

export const validateNameAll = (nameValue) => {
	if (!nameValue) return false;
	const nameWords = nameValue.trim().split(/\s+/);
	const validations = [
		!/\d/.test(nameValue),
		nameWords.length >= 2,
		nameWords.every((w) => w.length > 1),
		nameValue.length >= 6 && nameValue.length <= 20,
		/^[a-zA-Z ]+$/.test(nameValue),
	];
	return validations.every(Boolean);
};

export default NameValidationGrid;
