# Validata-JSTS

[![npm version](https://img.shields.io/npm/v/validata-jsts.svg)](https://www.npmjs.com/package/validata-jsts)  
[![npm downloads](https://img.shields.io/npm/dt/validata-jsts.svg)](https://www.npmjs.com/package/validata-jsts)  
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Dynamic, rule-based validation for JavaScript/TypeScript objects.  
Supports strings, numbers, booleans, dates, arrays, optional fields, custom conditions, error messages, and media validation.

---

## 🚀 Features

- Supports nested fields using dot notation
- Conditional and optional validation
- Custom error messages
- Date validation with min/max
- Password rule enforcement
- Media type and size validation

---

## 📦 Installation

```bash
npm install validata-jsts
```

---

## 🔧 Usage

```javascript
import { isInValiData } from 'validata-jsts';

const rules = [
	"user.name-string-min3-max20",
	"user.email-email",
	"user.age-number-min18",
	"user.birthdate-date-min1990_01_01-max2005_12_31",
	"user.password-pwd-min8-err:Password is weak",
	"user.isAdmin-boolean-optional",
	"user.media-object-mimetype:image/jpeg,size:2000000" // Max 2MB
];

const data = {
	user: {
		name: "Abraham",
		email: "abraham@example.com",
		age: 22,
		birthdate: "2002-04-07",
		password: "StrongPass123!"
	}
};

const result = isInValiData(rules, data);

if (result) {
	console.error("Validation failed:", result);
} else {
	console.log("Validation passed ✅");
}
```

---

## 📘 Rule Syntax

Each rule follows this format:

```text
fieldName-type-rules
```

### Supported Types

- `string`
- `number`
- `boolean`
- `array`
- `email`
- `pwd` (password)
- `date`
- `object` (for media)

### Optional and Conditional Rules

- `optional`: Skip validation if the field is missing.
- `conditional:field=value`: Only validate if the condition is met.

### Custom Error Messages

Add `err:Your error message` at the end of the rule.

### Date Format

Use `_` for separating year, month, and day:

```text
user.birthdate-date-min2020_01_01-max2023_12_31
```

---

## 🙌 Contributing

1. Fork this repo.
2. Clone your fork.
3. Create a new branch: `git checkout -b feature-name`.
4. Make your changes.
5. Commit: `git commit -m "Add feature"`.
6. Push to your fork: `git push origin feature-name`.
7. Open a Pull Request!

---
