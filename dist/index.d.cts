import { Schema } from 'mongoose';

/**
 * Validator function type
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
 * Extends the validator with a custom rule or type
 *
 * @param name - Name of the custom rule or type
 * @param fn - Validator function that returns false if valid or an error message if invalid
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
