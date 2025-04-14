You're absolutely right — thanks for catching that. A schema like this:

```ts
const schemaRule = {
  name: "string-min3-max30",
  email: "email",
  age: "number-min18",
  password: "pwd-min8",
  bio: "string-optional"
};
```

### 📌 Alternate Use Case Example: Signup Form

```ts
const schemaRule = [
	"name-string-min3-max30",
 "email-email",
	"age-number-min18",
	"password-pwd-min8",
	"bio-string-optional"
		];
```

**should not** have any `!` (negation) or invalid field definitions unless explicitly used in advanced rule strings — and even then, not in `validateWithSchema()` unless that's how the user wrote it.

And the `mongoose.Schema` example I gave earlier in the `extractRulesFromSchema()` section should reflect a real valid Mongoose schema object.

Let me correct the README with a clean, correct version that respects:

- proper schema definitions
- no unnecessary `!`
- proper Mongoose example
- and a properly documented usage of your API

---

Here's the **updated and clean** README:

---

# Validata-JSTS

[![npm version](https://img.shields.io/npm/v/validata-jsts.svg)](https://www.npmjs.com/package/validata-jsts)  
[![npm downloads](https://img.shields.io/npm/dt/validata-jsts.svg)](https://www.npmjs.com/package/validata-jsts)  
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Validata-JSTS** is a lightweight rule-based validation library for JavaScript/TypeScript. You can define flexible and powerful validation rules using strings or schema objects, including support for custom rules, nested fields, ObjectIds, arrays, and more.

---

## 🚀 Features

- ✅ Rule-based string validation
- ✅ Schema-based validation using `validateWithSchema`
- ✅ Auto-rule extraction from Mongoose schemas via `extractRulesFromSchema`
- ✅ Support for: `string`, `number`, `boolean`, `email`, `pwd`, `array`, `date`, `objectid`
- ✅ Custom error messages per rule
- ✅ Optional fields
- ✅ Nested field support (dot notation)
- ✅ Extendable with custom rules via `extendRule`

---

## 📦 Installation

```bash
npm install validata-jsts
```

---

## 🧠 Quick Example

```ts
import { isInValiData } from "validata-jsts";

const rules = [
  "name-string-min3-max20",
  "email-email",
  "age-number-min18-max99",
  "password-pwd-min8",
  "bio-string-optional"
];

const data = {
  name: "Abraham",
  email: "abraham@example.com",
  age: 25,
  password: "StrongPass123!"
};

const result = isInValiData(rules, data);

if (result) {
  console.log("❌ Validation errors:", result);
} else {
  console.log("✅ Passed validation");
}
```

---

## 🧾 Rule Format

```
fieldName-type-rule1-rule2-err:Custom error
```

### Supported Types

| Type      | Description                      |
|-----------|----------------------------------|
| string    | Text fields                      |
| number    | Numeric fields                   |
| boolean   | True/false values                |
| email     | Valid email address              |
| pwd       | Strong password (custom rules)   |
| date      | Date string in `YYYY-MM-DD`      |
| objectid  | Valid MongoDB ObjectId           |
| array     | Generic array support            |

---

## 🔍 Optional Fields

Use `optional` to allow a field to be skipped:

```ts
"bio-string-optional"
```

---

## ✏️ Custom Error Messages

Use `err:` or `valerr:` to specify your own messages:

```ts
"email-email-err:Invalid email address"
"password-pwd-min8-valerr:Password too weak"
```

---

## 🧠 Schema-Based Validation

### ✅ `validateWithSchema(schemaObject, data)`

```ts
import { validateWithSchema } from "validata-jsts";

const schema = {
  name: "string-min3-max30",
  email: "email",
  age: "number-min18",
  password: "pwd-min8",
  bio: "string-optional"
};

const data = {
  name: "John",
  email: "john@example.com",
  age: 22,
  password: "StrongPass1!"
};

const result = validateWithSchema(schema, data);
```

---

### ✅ `extractRulesFromSchema(mongooseSchema)`

```ts
import mongoose from "mongoose";
import { extractRulesFromSchema } from "validata-jsts";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  profile: {
    age: { type: Number, min: 16, required: true },
    bio: { type: String, maxlength: 400 }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const rules = extractRulesFromSchema(schema);

// Output:
[
  "name-string-req",
  "email-email",
  "password-pwd-req",
  "profile.age-number-req-min16",
  "profile.bio-string-max400",
  "userId-objectid-req"
]
```

---

## 🔧 Custom Rules with `extendRule`

```ts
import { extendRule, isInValiData } from "validata-jsts";

extendRule("startsWith", (value, expected) => {
  if (typeof value !== "string") return "Must be a string";
  if (!value.startsWith(expected)) return `Must start with ${expected}`;
  return null;
});

const rules = ["username-string-startsWith:dev"];
const data = { username: "devAbraham" };

const result = isInValiData(rules, data);
```

### Real Example: Nigerian Phone Number

```ts
extendRule("naPhone", (value) => {
  if (!/^(\+234|0)[789][01]\d{8}$/.test(value)) {
    return "Invalid Nigerian phone number";
  }
  return null;
});

const rules = ["phone-naPhone-err:Provide a valid Nigerian number"];
```

---

## 🧪 Type Rules Overview

### `string`
```ts
"name-string-min3-max50"
```

### `number`
```ts
"age-number-min18-max60"
```

### `boolean`
```ts
"isAdmin-boolean"
```

### `email`
```ts
"email-email"
```

### `pwd`
```ts
"password-pwd-min8"
```
Password must include:
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

### `date`
```ts
"birthdate-date-min1990_01_01-max2020_12_31"
```

### `objectid`
```ts
"userId-objectid"
```

### `array`
```ts
"tags-array"
```

---

## ⚠️ Known Limitations

- ❌ No strict nested array typing like `array<{ name: string }>` -  coming soon
- ❌ Conditional rules (`if:field=value`) -  coming soon
- ❌ Rule negation using `!` prefix (for rule strings) - coming soon
- ❌ File/media validation - coming soon

---

## 📌 Use Case Example: Signup Form

```ts
const rule = {
  name: "string-min3-max30",
  email: "email",
  password: "pwd-min8",
  confirmPassword: "string-equal:Password123!",
  acceptTerms: "boolean"
};

const input = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "Password123!",
  confirmPassword: "Password123!",
  acceptTerms: true
};

const result = isInValiData(rule, input);
```

### 📌 Alternate Use Case Example: Signup Form

```ts
const rule = [
	"name-string-min3-max30",
 "email-email","password-pwd-min8",
	"confirmPassword-string-equal:Password123!",
	"acceptTerms-boolean"
		];

const input = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "Password123!",
  confirmPassword: "Password123!",
  acceptTerms: true
};

const result = isInValiData(rule, input);
```

---

## 🙌 Contributing

1. Fork this repository
2. Create a branch: `git checkout -b feature-name`
3. Make your changes
4. Push and create a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE)

---

### ✅ Stable, flexible, lightweight — ready for validation-heavy apps.
Coming soon: conditional rules, nested object arrays, and media validation support.

---

Let me know if you'd like this in `README.md` format or published to your repo directly.
