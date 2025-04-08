import { DataType } from '../types/interface';
import { conditionsCheck, getValueFromPath } from './../lib/index';

const Validata = (rulesArray: string[], data: Record<string, any>): string | false => {
	// const getValueFromPath = (path: string, obj: any): any => {
	// 	return path.split('.').reduce((acc, key) => acc?.[key], obj);
	// };

	for (const ruleString of rulesArray) {
		const [rawField, ...ruleParts] = ruleString.split('-');
		const fieldParts = rawField.split('.');
		const field = fieldParts.pop()!;
		const nestedPath = fieldParts.length ? fieldParts.join('.') + '.' + field : field;
		const value = getValueFromPath(nestedPath, data);

		// Here custom error message is handled/captured with "err:" prefix
		let customErrorRule = ruleParts.find(part => part.startsWith('err:'));
		let customErrorMessage = customErrorRule?.split('err:')[1];
		if (customErrorRule) {
			ruleParts.splice(ruleParts.indexOf(customErrorRule), 1);
		}

		let type: DataType | null = null;
		let min: number | undefined;
		let max: number | undefined;
		let exact: number | undefined;
		let isAnyPwd = ruleParts.includes('any');

		for (const part of ruleParts) {
			if (['string', 'number', 'boolean', 'array', 'email', 'pwd', 'date'].includes(part)) {
				type = part as DataType;
			} else if (part.startsWith('min')) {
				min = parseInt(part.replace('min', ''), 10);
			} else if (part.startsWith('max')) {
				max = parseInt(part.replace('max', ''), 10);
			} else if (/^\d+$/.test(part)) {
				exact = parseInt(part, 10);
			}
		}

		// Handle "optional" rules
		const optional = ruleParts.includes('optional');

		// Skip validation if "optional" is true and the field is missing
		if (optional && value === undefined) {
			continue;  // Skip validation for this field
		}


if (conditionsCheck(ruleParts, data, getValueFromPath))		continue
		// Check if field is missing from the data (if it's in the rules)
		if (value === undefined) {
			return customErrorMessage || `${nestedPath} is required`;
		}

		// Determine the type based on the first part of the rule
		if (type === 'string' && typeof value !== 'string') return `${nestedPath} must be a string`;
		if (type === 'number' && typeof value !== 'number') return `${nestedPath} must be a number`;
		if (type === 'boolean' && typeof value !== 'boolean') return `${nestedPath} must be a boolean`;
		if (type === 'array' && !Array.isArray(value)) return `${nestedPath} must be an array`;

		// Email validation
		if (type === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (typeof value !== 'string' || !emailRegex.test(value)) {
				return `${nestedPath} must be a valid email`;
			}
		}

		// Length checks (for strings or arrays)
		if ((typeof value === 'string' || Array.isArray(value)) && type !== 'date') {

			if (exact && value.length !== exact) return `${nestedPath} must be exactly ${exact} characters long, currently ${value.length}`;

			if (min && value.length < min) return `${nestedPath} must be at least ${min} characters long`;
			if (max && value.length > max) return `${nestedPath} must be no more than ${max} characters long`;
		}

		if (type === 'date') {
			const dateValue = new Date(value);
			if (isNaN(dateValue.getTime())) return `${nestedPath} must be a valid date`;

			if (min && new Date(dateValue) < new Date(min.toString().replace(/_/g, '-')))
				return `${nestedPath} must be after ${min.toString().replace(/_/g, '-')}`;

			if (max && new Date(dateValue) > new Date(max.toString().replace(/_/g, '-')))
				return `${nestedPath} must be before ${max.toString().replace(/_/g, '-')}`;

			if (exact && new Date(dateValue).toISOString().split('T')[0] !== exact.toString().replace(/_/g, '-')) {
				return `${nestedPath} must be exactly ${exact.toString().replace(/_/g, '-')}`;
			}
		}


		// Password special rules
		if (type === 'pwd' && typeof value === 'string') {
			const lengthToUse = exact || min || 8;
			if (value.length < lengthToUse) return `${nestedPath} must be at least ${lengthToUse} characters`;
			if (max && value.length > max) return `${nestedPath} must be no more than ${max} characters`;

			if (!isAnyPwd) {
				const hasUpperCase = /[A-Z]/.test(value);
				const hasLowerCase = /[a-z]/.test(value);
				const hasNumber = /\d/.test(value);
				const hasPunctuation = /[!@#$%^&*(),.?":{}|<>]/.test(value);
				if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasPunctuation) {
					return customErrorMessage || `${nestedPath} must include uppercase, lowercase, number, and special character`;
				}
			}
		}
	}

	return false;
};

export const isInValiData = Validata
export const isValiData = Validata 
