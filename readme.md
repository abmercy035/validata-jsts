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



🔧 Usage

import { checkData } from 'validata-jsts';

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
    password: "StrongPass123!",
    media: {
      mimetype: "image/jpeg",
      size: 1800000
    }
  }
};

const result = checkData(rules, data);

if (result) {
  console.error("Validation failed:", result);
} else {
  console.log("Validation passed ✅");
}


📘 Rule Syntax
Each rule follows this format:
fieldName-type-rules

Supported Types
string

number

boolean

array

email

pwd (password)

date

object (for media)

Optional and Conditional
optional: skip validation if field is missing

conditional:field=value: only validate if condition is met

Custom Error
Add err:Your error message at the end of the rule

Date format
Use _ for separating year, month, and day:

ts
Copy
Edit
user.birthdate-date-min2020_01_01-max2023_12_31


🙌 Contributing
Fork this repo

Clone your fork

Create a new branch (git checkout -b feature-name)

Make your changes

Commit (git commit -m "Add feature")

Push to your fork (git push origin feature-name)

Open a Pull Request!

