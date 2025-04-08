import { validataType } from "../types/interface";

export const conditionsCheck = (ruleParts: string[], data: validataType["data"], getValueFromPath: (arg0: string, arg1: validataType["data"]) => string) => {

	// Check if the rule includes a conditional and extract it
	let condition: string | null | undefined = null;

	const parseValue = (val: string): any => {
		if (val === 'true') return true;
		if (val === 'false') return false;
		if (!isNaN(Number(val))) return Number(val);
		return val;
	};

	if (ruleParts.some(part => part.startsWith('cond:'))) {
		const conditionRule = ruleParts.find(part => part.startsWith('cond:'));
		condition = conditionRule?.split(':')[1]; // Extract the condition value
	}

	// If the field is conditional, check the condition before running the validation

	// Conditional check (e.g., in a case where we want to ingnore validation for an, if isAdmin is true, skip validation)
	if (condition) {
		const [conditionField, conditionValue] = condition.split('=');

		const conditionFieldValue = getValueFromPath(conditionField, data);
		if (conditionFieldValue === undefined || conditionFieldValue == null) {
			return `${conditionField} is ${conditionFieldValue} but is required to check the condition`;
		}
		const parsedConditionValue = parseValue(conditionValue);
		// Convert both sides to string for comparison if needed
		if (conditionFieldValue == parsedConditionValue) {
			return true;  // Skip validation if condition is not met
		}
	}
}

export const getValueFromPath = (path: string, obj: any): any => {
	return path.split('.').reduce((acc, key) => acc?.[key], obj);
};
