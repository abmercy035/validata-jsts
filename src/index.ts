import { Validata } from "./core/validataData"
// Main entry point for the library
export { Validata } from "./core/validataData"
export { extend as extendValidata } from "./core/extend"
export { extractRulesFromSchema } from "./mongoose/extractRules"
export { validateWithSchema } from "./mongoose"

// Types
export type { ValidationResult, ValidatorFn } from "./utils/types"

export const isNotValidata = Validata
export const isInValidata = Validata
export const isInValiData = Validata
