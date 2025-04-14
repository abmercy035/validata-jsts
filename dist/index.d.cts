import { Schema } from 'mongoose';

/**
 * Validator function type
 */
/**
 * A function type that validates a given value based on specified conditions and configuration.
 *
 * @typeParam value - The value to be validated. Can be of any type.
 * @typeParam conditions - An optional array of strings representing the conditions or rules
 *                         that the value must satisfy.
 * @typeParam config - An optional object containing additional configuration or parameters
 *                     for the validation logic.
 *
 * @returns A string indicating the validation error message if the validation fails,
 *          or `false` if the validation passes successfully.
 */
type ValidatorFn = (value: any, conditions?: string[], config?: Record<string, any>) => string | false;
/**
 * Validation result
 */
type ValidationResult = string | false;

/**
    * Main validation function that checks data against an array of rule strings
    *
    * @param inputRules - Array of rule strings in format "fieldName-type-condition1-condition2"
    * @param data - Object containing the data to validate
    * @param config - Optional configuration object for custom validators
    * @returns Array of error messages or false if validation passes
    */
declare function Validata(inputRules: Record<string, string[]> | string[], data: Record<string, any>, config?: Record<string, any>): ValidationResult;

/**
 * Extends the custom validators by adding a new validator function.
 * If a validator with the same name already exists, it will be overridden,
 * and a warning will be logged to the console.
 *
 * @param name - The name of the custom validator to add or override.
 * @param fn - The validator function to associate with the given name.
 *             The function should follow the `ValidatorFn` type signature.
 *
 * ValidatorFn:
 * A function that validates a value based on optional conditions and configuration.
 *
 * @example
 * // Define a custom validator function
 * const isEven: ValidatorFn = (value, conditions, config) => {
 *   if (typeof value !== 'number') {
 *     return 'Value must be a number';
 *   }
 *   if (value % 2 !== 0) {
 *     return 'Value is not even';
 *   }
 *   return false; // Validation passed
 * };
 *
 * // Extend the custom validators with the new function
 * extend('isEven', isEven);
 *
 * @example
 * // Using the custom validator with conditions and config
 * const maxLengthValidator: ValidatorFn = (value, conditions, config={maxLength : 5}) => {
 *   const maxLength = config?.maxLength || 10; // Default max length is 10
 *   if (typeof value !== 'string') {
 *     return 'Value must be a string';
 *   }
 *   if (value.length > maxLength) {
 *     return `Value exceeds maximum length of ${maxLength}`;
 *   }
 *   return false; // Validation passed
 * };
 *
 * extend('maxLength', maxLengthValidator);
 *
 * // Example usage
 const rules = ["idNumber-maxLengthValidator-err:Value exceeds maximum length of 5"];

 * const value ={ idNumber :"123456"}; // Example value to validate
 * const result = isInValidata(rules, value)
 * console.log(result); // Output: "idNumber: Value exceeds maximum length of 5"
 */
declare function extend(name: string, fn: ValidatorFn): void;

/**
    * Extracts validation rules from a Mongoose schema.
    *
    * @param input - A Mongoose Schema or an object with a `schema` property.
    * @returns Array of rule strings
    *
    * @example
    * const mongoose = require("mongoose");
    * const schema = new mongoose.Schema({
    *   name: { type: String, required: true, minlength: 3, maxlength: 50 },
    *   age: { type: Number, min: 18, max: 99 },
    *   email: { type: String, required: true, match: /.+\@.+\..+/ },
    * });
    * const rules = extractRulesFromSchema(schema);
    * console.log(rules);
    * // Output: [
    * //   "name-string-req-name-min3-valerr:name must be more than 3 characters-name-max50-valerr:name cannot be more than 50 characters",
    * //   "age-number-min18-max99",
    * //   "email-email-req-email-valerr:email is required"
    * // ]
    */
declare function extractRulesFromSchema(input: Schema | {
    schema: Schema;
}): string[];

/**
    * Validates data against a Mongoose schema
    *
    * @param schema - Mongoose schema object
    * @param data - Object containing the data to validate
    * @param config - Optional configuration object for custom validators
    * @returns Array of error messages or false if validation passes
    *
    * @example
    * const schema = new Schema({
    *   name: { type: String, required: true },
    *   age: { type: Number, min: 18 },
    * });
    *
    * const data = { name: "John Doe", age: 17 };
    *
    * const result = validateWithSchema(schema, data);
    * console.log(result); // [{ field: "age", message: "Age must be at least 18" }]
    */
declare function validateWithSchema(schema: Schema, data: Record<string, any>, config?: Record<string, any>): ValidationResult;

declare const isNotValidata: typeof Validata;
declare const isInValidata: typeof Validata;
declare const isInValiData: typeof Validata;

export { Validata, type ValidationResult, type ValidatorFn, extend as extendValidata, extractRulesFromSchema, isInValiData, isInValidata, isNotValidata, validateWithSchema };
