"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Validata: () => Validata,
  extendValidata: () => extend,
  extractRulesFromSchema: () => extractRulesFromSchema,
  isInValiData: () => isInValiData,
  isInValidata: () => isInValidata,
  isNotValidata: () => isNotValidata,
  validateWithSchema: () => validateWithSchema
});
module.exports = __toCommonJS(index_exports);

// src/core/extend.ts
var customValidators = {};
function extend(name, fn) {
  if (name in customValidators) {
    console.warn(`Validator '${name}' is being overridden`);
  }
  customValidators[name] = fn;
}

// src/core/parser.ts
function parseRule(rule) {
  const parts = rule.split("-");
  if (parts.length < 2) {
    throw new Error(`Invalid rule format: ${rule}. Expected format: "fieldName-type-condition1-condition2"`);
  }
  const field = parts[0];
  const type = parts[1];
  let conditions = parts.slice(2);
  let isRequired = false;
  if (type.endsWith("!")) {
    isRequired = true;
    parts[1] = type.slice(0, -1);
  }
  conditions = conditions.map((condition) => {
    if (condition.endsWith("!")) {
      isRequired = true;
      return condition.slice(0, -1);
    }
    return condition;
  });
  if (isRequired && !conditions.includes("req")) {
    conditions.push("req");
  }
  return {
    field,
    type: parts[1],
    // Use the potentially modified type
    conditions,
    originalRule: rule
  };
}

// src/utils/constants.ts
var DEFAULT_ERROR_MESSAGES = {
  string: "must be a string",
  number: "must be a number",
  boolean: "must be a boolean",
  email: "must be a valid email",
  array: "must be an array",
  date: "must be a valid date",
  pwd: "must contain one uppercase, one lowercase, one number, and one special character",
  required: "is required",
  objectId: "must be a valid ObjectId",
  objectIdArray: "must be an array of ObjectIds",
  objectIdOrString: "must be a valid ObjectId or string",
  min: (min, type) => {
    if (type === "string") return `must be at least ${min} characters`;
    if (type === "number") return `must be greater than or equal to ${min}`;
    if (type === "array") return `must have at least ${min} items`;
    return `must be at least ${min}`;
  },
  max: (max, type) => {
    if (type === "string") return `must be at most ${max} characters`;
    if (type === "number") return `must be less than or equal to ${max}`;
    if (type === "array") return `must have at most ${max} items`;
    return `must be at most ${max}`;
  }
};

// src/utils/helpers.ts
function normalizeRules(inputRules) {
  const result = [];
  if (Array.isArray(inputRules)) {
    return inputRules;
  }
  for (const field in inputRules) {
    const fieldRules = inputRules[field];
    for (const rule of fieldRules) {
      const isPrefixed = rule.startsWith(`${field}-`);
      result.push(isPrefixed ? rule : `${field}-${rule}`);
    }
  }
  return result;
}
function isEmail(value) {
  if (typeof value !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
function isValidPassword(value) {
  if (typeof value !== "string") return false;
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}
function extractErrorMessage(conditions, failedCondition) {
  if (!conditions) return null;
  const errorCondition = conditions.find((c) => c.startsWith(`valerr:${failedCondition}`));
  return errorCondition ? errorCondition.substring(7) : null;
}
function getValueFromPath(path, obj) {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === void 0 || current === null) {
      return void 0;
    }
    current = current[part];
  }
  return current;
}
function isValidObjectId(value) {
  if (typeof value !== "string") return false;
  return /^[0-9a-fA-F]{24}$/.test(value);
}
function isValidDate(value) {
  if (value instanceof Date) return !isNaN(value.getTime());
  const date = new Date(value);
  return !isNaN(date.getTime());
}
function getErrorMessage(type, params) {
  const errorMessage = DEFAULT_ERROR_MESSAGES[type];
  if (typeof errorMessage === "string") {
    return errorMessage;
  }
  if (typeof errorMessage === "function") {
    if (type === "min" && params?.min !== void 0 && params?.type) {
      return errorMessage(params.min, params.type);
    }
    if (type === "max" && params?.max !== void 0 && params?.type) {
      return errorMessage(params.max, params.type);
    }
  }
  return "Unknown error";
}

// src/core/builtInValidator.ts
var builtInValidators = {
  // Type validators
  string: (value) => {
    if (typeof value !== "string") return getErrorMessage("string");
    if (value.trim() === "") return "must be a non-empty string";
    return false;
  },
  number: (value) => {
    return typeof value === "number" ? false : getErrorMessage("number");
  },
  boolean: (value) => {
    return typeof value === "boolean" ? false : getErrorMessage("boolean");
  },
  email: (value) => {
    return isEmail(value) ? false : getErrorMessage("email");
  },
  array: (value) => {
    return Array.isArray(value) ? false : getErrorMessage("array");
  },
  date: (value, conditions) => {
    if (!isValidDate(value)) return getErrorMessage("date");
    const dateValue = new Date(value);
    const exactCondition = conditions?.find((c) => /^\d+$/.test(c));
    if (exactCondition) {
      const exactDate = new Date(exactCondition.replace(/_/g, "-"));
      if (dateValue.toISOString().split("T")[0] !== exactDate.toISOString().split("T")[0]) {
        return `must be exactly ${exactDate.toISOString().split("T")[0]}`;
      }
    }
    const minCondition = conditions?.find((c) => c.startsWith("min"));
    if (minCondition) {
      const minDate = new Date(minCondition.substring(3).replace(/_/g, "-"));
      if (dateValue < minDate) {
        return `must be after ${minDate.toISOString().split("T")[0]}`;
      }
    }
    const maxCondition = conditions?.find((c) => c.startsWith("max"));
    if (maxCondition) {
      const maxDate = new Date(maxCondition.substring(3).replace(/_/g, "-"));
      if (dateValue > maxDate) {
        return `must be before ${maxDate.toISOString().split("T")[0]}`;
      }
    }
    return false;
  },
  objectid: (value) => {
    return isValidObjectId(value) ? false : "must be a valid MongoDB ObjectId";
  },
  pwd: (value, conditions) => {
    if (typeof value !== "string") return getErrorMessage("string");
    const exactCondition = conditions?.find((c) => /^\d+$/.test(c));
    const minCondition = conditions?.find((c) => c.startsWith("min"));
    const maxCondition = conditions?.find((c) => c.startsWith("max"));
    const lengthToUse = exactCondition ? Number.parseInt(exactCondition, 10) : minCondition ? Number.parseInt(minCondition.substring(3), 10) : 8;
    if (value.length < lengthToUse) {
      return getErrorMessage("min", { min: lengthToUse, type: "string" });
    }
    if (maxCondition) {
      const maxValue = Number.parseInt(maxCondition.substring(3), 10);
      if (value.length > maxValue) {
        return getErrorMessage("max", { max: maxValue, type: "string" });
      }
    }
    if (conditions?.includes("any")) {
      return false;
    }
    return isValidPassword(value) ? false : "must include uppercase, lowercase, number, and special character";
  }
};

// src/core/ruleExecutor.ts
function executeRule(field, type, conditions, value, config) {
  const errors = [];
  const customError = (cond) => extractErrorMessage(conditions, cond);
  if (conditions.includes("req") && (value === void 0 || value === null)) {
    if (value === "") {
      errors.push(formatError(field, customError("req") || "is empty but is required"));
      return errors.length > 0 ? errors.join(", ") : false;
    }
    errors.push(formatError(field, customError("req") || "is required"));
    return errors.length > 0 ? errors.join(", ") : false;
  }
  if (value === void 0 || value === null) {
    return errors.length > 0 ? errors.join(", ") : false;
  }
  const exactCondition = conditions.find((c) => /^\d+$/.test(c));
  if (exactCondition && (typeof value === "string" || Array.isArray(value))) {
    const exactValue = Number.parseInt(exactCondition, 10);
    if (value.length !== exactValue) {
      errors.push(
        formatError(field, customError("string") || `must be exactly ${exactValue} characters long, currently ${value.length}`)
      );
      return errors.length > 0 ? errors.join(", ") : false;
    }
  }
  console.log(type);
  console.log(type.startsWith("array<"));
  if (type.startsWith("array<") && Array.isArray(value)) {
    const isValid = checkSingleType(value, type);
    if (!isValid) {
      errors.push(formatError(field, customError("array<") || `Invalid value for ${field}. Expected type: ${type}`));
      return errors.length > 0 ? errors.join(", ") : false;
    }
    return false;
  }
  if (type in builtInValidators) {
    const error = builtInValidators[type](value, conditions, config);
    if (error) {
      errors.push(formatError(field, customError("") || error));
      return errors.length > 0 ? errors.join(", ") : false;
    }
  } else if (customValidators[type]) {
    const error = customValidators[type](value, conditions, config);
    if (error) {
      errors.push(formatError(field, customError(config?.["err"]) || error));
    }
  }
  for (const condition of conditions) {
    if (condition === "req" || condition === "optional" || condition.startsWith("valerr:") || /^\d+$/.test(condition))
      continue;
    if (isMinMaxCondition(condition)) {
      const error = processMinMaxCondition(condition, value, config);
      if (error) {
        errors.push(formatError(field, customError(condition) || error));
      }
      continue;
    }
    if (condition.startsWith("enum:")) {
      const error = processEnumCondition(condition, value);
      if (error) {
        errors.push(formatError(field, customError(condition) || error));
      }
      continue;
    }
    if (condition in builtInValidators) {
      const error = builtInValidators[condition](value, conditions, config);
      if (error) {
        errors.push(formatError(field, customError(config?.["err"]) || error));
      }
    } else if (customValidators[condition]) {
      const error = customValidators[condition](value, [], config);
      if (error) {
        errors.push(formatError(field, customError(config?.["err"]) || error));
      }
    }
  }
  return errors.length > 0 ? errors.join(", ") : false;
}
function isMinMaxCondition(condition) {
  return /^(min|max)\d+$/.test(condition);
}
function processMinMaxCondition(condition, value, config) {
  if (condition.startsWith("min")) {
    const minValue = Number.parseInt(condition.substring(3));
    if (typeof value === "string") {
      return value.length >= minValue ? false : `must be at least ${minValue} characters long`;
    }
    if (typeof value === "number") {
      return value >= minValue ? false : `must be greater than or equal to ${minValue}`;
    }
    if (Array.isArray(value)) {
      return value.length >= minValue ? false : `must have at least ${minValue} items`;
    }
  }
  if (condition.startsWith("max")) {
    const maxValue = Number.parseInt(condition.substring(3));
    if (typeof value === "string") {
      return value.length <= maxValue ? false : `must be no more than ${maxValue} characters long`;
    }
    if (typeof value === "number") {
      return value <= maxValue ? false : `must be less than or equal to ${maxValue}`;
    }
    if (Array.isArray(value)) {
      return value.length <= maxValue ? false : `must have no more than ${maxValue} items`;
    }
  }
  return false;
}
function processEnumCondition(condition, value) {
  const allowedValues = condition.substring(5).split("|");
  return allowedValues.includes(value) ? false : `must be one of: ${allowedValues.join(", ")}`;
}
function checkSingleType(value, type) {
  if (type.startsWith("array<")) {
    if (!Array.isArray(value)) return false;
    const innerType = extractInnerArrayType(type);
    return value.every((item) => checkSingleType(item, innerType));
  }
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "objectId":
      return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
    case "date":
      return value instanceof Date || typeof value === "string" && !isNaN(Date.parse(value));
    default:
      return true;
  }
}
function extractInnerArrayType(type) {
  let depth = 0;
  let current = type;
  while (current.startsWith("array<")) {
    current = current.slice(6, -1);
    depth++;
  }
  return type.slice(6, -1);
}
function formatError(field, error) {
  return `${field}: ${error}`;
}

// src/core/validataData.ts
function Validata(inputRules, data, config) {
  const rules = normalizeRules(inputRules);
  const errors = [];
  if (!Array.isArray(rules) || typeof data !== "object" || data === null) {
    throw new Error("Invalid arguments: rules must be an array and data must be an object");
  }
  for (const rule of rules) {
    const { field, type, conditions } = parseRule(rule);
    let value = getValueFromPath(field, data);
    const defCond = conditions.find((cond) => cond.startsWith("def:"));
    if ((value === void 0 || value === null) && defCond) {
      try {
        let parsed = JSON.parse(defCond.substring(4));
        if (rule.includes("date")) {
          parsed = new Date(parsed);
        }
        value = parsed;
        data[field] = value;
      } catch (e) {
        let fallback = defCond.substring(4);
        if (rule.includes("date")) {
          fallback = new Date(fallback).toISOString();
        }
        value = fallback;
        data[field] = fallback;
      }
    }
    if (conditions.includes("optional") && value === void 0) {
      continue;
    }
    if (value === void 0 && !conditions.includes("req")) {
      continue;
    }
    if (conditions.includes("validate:fn") && customValidators[field]) {
      const result = customValidators[field](value, data, config);
      if (result) {
        errors.push(`${field} ${result}`);
      }
    }
    const fieldErrors = executeRule(field, type, conditions, value, config);
    if (fieldErrors) {
      errors.push(fieldErrors);
    }
  }
  return errors.length > 0 ? errors.join(", ") : false;
}

// src/mongoose/extractRules.ts
function extractRulesFromSchema(input) {
  const schema = "schema" in input ? input.schema : input;
  const rules = [];
  const paths = schema.paths || {};
  for (const [field, path] of Object.entries(paths)) {
    if (field.startsWith("_")) continue;
    const simplifiedPath = path;
    const rule = buildRuleFromPath(field, simplifiedPath);
    if (rule) rules.push(rule);
  }
  return rules;
}
function buildRuleFromPath(field, path) {
  if (!path || !path.instance) return null;
  const lowered = field.toLowerCase();
  const type = fieldNameTypeOverrides[lowered] ?? getActualType(path);
  const conditions = [];
  if (isActuallyRequired(path)) {
    conditions.push("req");
  }
  if (typeof path.options?.min === "number") {
    conditions.push(`min${path.options.min}`);
  }
  if (typeof path.options?.max === "number") {
    conditions.push(`max${path.options.max}`);
  }
  console.log(path.instance);
  if (path.instance === "String") {
    const minLen = extractValue(path.options?.minlength);
    const maxLen = extractValue(path.options?.maxlength);
    const minMsg = extractMessage(path.options?.minlength);
    const maxMsg = extractMessage(path.options?.maxlength);
    const isReq = extractValue(path.options?.required);
    const reqMsg = extractMessage(path.options?.required);
    if (minLen != null) {
      const msg = minMsg || `${field} must be more than ${minLen} characters`;
      conditions.push(`${field}-min${minLen}-valerr:${msg}`);
    }
    if (maxLen != null) {
      const msg = maxMsg || `${field} cannot be more than ${maxLen} characters`;
      conditions.push(`${field}-max${maxLen}-valerr:${msg}`);
    }
    if (isReq) {
      const msg = reqMsg || `${field} is required`;
      conditions.push(`${field}-req-valerr:${msg}`);
    }
  }
  const enumVals = path.enumValues ?? path.options?.enum;
  if (Array.isArray(enumVals) && enumVals.length > 0) {
    conditions.push(`enum:${enumVals.join("|")}`);
  }
  if (typeof path.options?.message === "string" && path.options.message.trim() !== "") {
    conditions.push(`err:${path.options.message}`);
  }
  if (path.options?.default !== void 0) {
    let defValue = path.options.default;
    if (typeof defValue === "function") {
      try {
        defValue = defValue();
      } catch (e) {
        defValue = void 0;
      }
    }
    const isValidDefault = Array.isArray(defValue) && defValue.length > 0 || typeof defValue === "string" && defValue.trim() !== "" || (typeof defValue === "number" || typeof defValue === "boolean") || defValue && typeof defValue === "object" && !Array.isArray(defValue) && Object.keys(defValue).length > 0;
    if (isValidDefault) {
      conditions.push(`def:${typeof defValue === "string" ? defValue : JSON.stringify(defValue)}`);
    }
  }
  if (typeof path.options?.alias === "string" && path.options.alias.trim() !== "") {
    conditions.push(`alias:${path.options.alias}`);
  }
  if (typeof path.options?.select === "boolean") {
    conditions.push(`select:${path.options.select}`);
  }
  if (path.options?.validate) {
    if (typeof path.options.validate === "function") {
      conditions.push("validate:fn");
    } else if (typeof path.options.validate === "object" && typeof path.options.validate.validator === "function") {
      conditions.push("validate:fn");
      if (typeof path.options.validate.message === "string" && path.options.validate.message.trim() !== "") {
        conditions.push(`valerr:${path.options.validate.message}`);
      }
    }
  }
  return `${field}-${type}${conditions.length > 0 ? "-" + conditions.join("-") : ""}`;
}
function isActuallyRequired(path) {
  const requiredOption = path?.options?.required;
  if (Array.isArray(requiredOption)) {
    return requiredOption[0] === true;
  }
  return requiredOption === true;
}
function mapMongooseTypeToValidataType(mongooseType) {
  const typeMap = {
    String: "string",
    Number: "number",
    Boolean: "boolean",
    Date: "date",
    Array: "array",
    ObjectId: "objectId",
    ObjectID: "objectId",
    Decimal128: "decimal",
    Buffer: "buffer",
    Mixed: "mixed",
    Map: "map"
  };
  return typeMap[mongooseType] || "string";
}
function getActualType(path) {
  if (path.instance === "Array" && path.caster?.instance) {
    const casterType = path.caster.instance;
    return `array<${mapMongooseTypeToValidataType(casterType)}>`;
  }
  return mapMongooseTypeToValidataType(path.instance);
}
var fieldNameTypeOverrides = {
  email: "email",
  password: "pwd",
  pwd: "pwd",
  contactEmail: "email",
  user_email: "email",
  newPassword: "pwd",
  confirmPassword: "pwd"
};
var extractValue = (option) => {
  return Array.isArray(option) ? option[0] : option;
};
var extractMessage = (option) => {
  return Array.isArray(option) && typeof option[1] === "string" ? option[1] : void 0;
};

// src/mongoose/validataWithSchema.ts
function validateWithSchema(schema, data, config) {
  const rules = extractRulesFromSchema(schema);
  return Validata(rules, data, config);
}

// src/index.ts
var isNotValidata = Validata;
var isInValidata = Validata;
var isInValiData = Validata;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validata,
  extendValidata,
  extractRulesFromSchema,
  isInValiData,
  isInValidata,
  isNotValidata,
  validateWithSchema
});
