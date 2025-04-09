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
  isInValiData: () => isInValiData,
  isValiData: () => isValiData
});
module.exports = __toCommonJS(index_exports);

// src/utils/index.ts
var conditionsCheck = (ruleParts, data, getValueFromPath2) => {
  let condition = null;
  const parseValue = (val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    if (!isNaN(Number(val))) return Number(val);
    return val;
  };
  if (ruleParts.some((part) => part.startsWith("cond:"))) {
    const conditionRule = ruleParts.find((part) => part.startsWith("cond:"));
    condition = conditionRule?.split(":")[1];
  }
  if (condition) {
    const [conditionField, conditionValue] = condition.split("=");
    const conditionFieldValue = getValueFromPath2(conditionField, data);
    if (conditionFieldValue === void 0 || conditionFieldValue == null) {
      return `${conditionField} is ${conditionFieldValue} but is required to check the condition`;
    }
    const parsedConditionValue = parseValue(conditionValue);
    if (conditionFieldValue != parsedConditionValue) {
      return true;
    }
  }
};
var getValueFromPath = (path, obj) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

// src/engine/index.ts
var Validata = (rulesArray, data) => {
  for (const ruleString of rulesArray) {
    const [rawField, ...ruleParts] = ruleString.split("-");
    const fieldParts = rawField.split(".");
    const field = fieldParts.pop();
    const nestedPath = fieldParts.length ? fieldParts.join(".") + "." + field : field;
    const value = getValueFromPath(nestedPath, data);
    let customErrorRule = ruleParts.find((part) => part.startsWith("err:"));
    let customErrorMessage = customErrorRule?.split("err:")[1];
    if (customErrorRule) {
      ruleParts.splice(ruleParts.indexOf(customErrorRule), 1);
    }
    let type = null;
    let min;
    let max;
    let exact;
    let isAnyPwd = ruleParts.includes("any");
    for (const part of ruleParts) {
      if (["string", "number", "boolean", "array", "email", "pwd", "date"].includes(part)) {
        type = part;
      } else if (part.startsWith("min")) {
        min = parseInt(part.replace("min", ""), 10);
      } else if (part.startsWith("max")) {
        max = parseInt(part.replace("max", ""), 10);
      } else if (/^\d+$/.test(part)) {
        exact = parseInt(part, 10);
      }
    }
    const optional = ruleParts.includes("optional");
    if (optional && value === void 0) {
      continue;
    }
    if (conditionsCheck(ruleParts, data, getValueFromPath)) continue;
    if (value === void 0) {
      return customErrorMessage || `${nestedPath} is required`;
    }
    if (type === "string" && value.trim() === "") return `${nestedPath} must be a non-empty string`;
    if (type === "string" && typeof value !== "string") return `${nestedPath} must be a string`;
    if (type === "number" && typeof value !== "number") return `${nestedPath} must be a number`;
    if (type === "boolean" && typeof value !== "boolean") return `${nestedPath} must be a boolean`;
    if (type === "array" && !Array.isArray(value)) return `${nestedPath} must be an array`;
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value !== "string" || !emailRegex.test(value)) {
        return `${nestedPath} must be a valid email`;
      }
    }
    if ((typeof value === "string" || Array.isArray(value)) && type !== "date") {
      if (exact && value.length !== exact) return `${nestedPath} must be exactly ${exact} characters long, currently ${value.length}`;
      if (min && value.length < min) return `${nestedPath} must be at least ${min} characters long`;
      if (max && value.length > max) return `${nestedPath} must be no more than ${max} characters long`;
    }
    if (type === "date") {
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) return `${nestedPath} must be a valid date`;
      if (min && new Date(dateValue) < new Date(min.toString().replace(/_/g, "-")))
        return `${nestedPath} must be after ${min.toString().replace(/_/g, "-")}`;
      if (max && new Date(dateValue) > new Date(max.toString().replace(/_/g, "-")))
        return `${nestedPath} must be before ${max.toString().replace(/_/g, "-")}`;
      if (exact && new Date(dateValue).toISOString().split("T")[0] !== exact.toString().replace(/_/g, "-")) {
        return `${nestedPath} must be exactly ${exact.toString().replace(/_/g, "-")}`;
      }
    }
    if (type === "pwd" && typeof value === "string") {
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
var engine_default = Validata;

// src/index.ts
var isInValiData = engine_default;
var isValiData = engine_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isInValiData,
  isValiData
});
