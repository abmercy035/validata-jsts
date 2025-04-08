import { isInValiData } from '../src/index.ts';

describe('Validate a complete form data', () => {
	it('should return false for valid input', () => {
		const data = { name: 'John', age: 30 };
		const rulesArray = ['name-string', 'age-number'];
		expect(isInValiData(rulesArray, data)).toBe(false);
	});

	it('should return error message for missing required fields', () => {
		const data = { name: 'John' };
		const rulesArray = ['name-string', 'age-number'];
		expect(isInValiData(rulesArray, data)).toBe("age is required");
	});
});

describe('Validate admin form data', () => {
	it('should return false for invalid input of password for admins only', () => {
		const data = { name: 'John', age: 30, password: 123, admin: true };
		const rulesArray = ['name-string', 'age-number', 'password-string-any-cond:admin=true'];
		expect(isInValiData(rulesArray, data)).toBe(false);
	});

	it('should return error message for invalid input of password for non-admins', () => {
		const data = { name: 'John', age: 30, password: 123, admin: false };
		const rulesArray = ['name-string', 'age-number', 'password-string-any-cond:admin=true'];
		expect(isInValiData(rulesArray, data)).toBe("password must be a string");
	});

	it('should validate complex nested objects', () => {
		const data = {
			name: 'John',
			age: 30,
			address: {
				city: 'New York',
				zip: 10001,
			},
		};
		const rulesArray = [
			'name-string',
			'age-number',
			'address-object',
			'address.city-string',
			'address.zip-number',
		];
		expect(isInValiData(rulesArray, data)).toBe(false);
	});

	it('should return error message for invalid nested object fields', () => {
		const data = {
			name: 'John',
			age: 30,
			address: {
				city: 'New York',
				zip: 'invalid-zip',
			},
		};
		const rulesArray = [
			'name-string',
			'age-number',
			'address-object',
			'address.city-string',
			'address.zip-number',
		];
		expect(isInValiData(rulesArray, data)).toBe("address.zip must be a number");
	});
});

describe('Validate conditional rules', () => {
	it('should validate data based on conditional rules', () => {
		const data = { name: 'John', age: 30, role: 'admin', permissions: ['read', 'write'] };
		const rulesArray = [
			'name-string',
			'age-number',
			'role-string',
			'permissions-array-any-cond:role=admin',
		];
		expect(isInValiData(rulesArray, data)).toBe(false);
	});

	it('should return error message for failing conditional rules', () => {
		const data = { name: 'John', age: 30, role: 'user', permissions: 'read' };
		const rulesArray = [
			'name-string',
			'age-number',
			'role-string',
			'permissions-array-any-cond:role=admin',
		];
		expect(isInValiData(rulesArray, data)).toBe("permissions must be an array");
	});
});

describe('Validate edge cases', () => {
	it('should handle empty data gracefully', () => {
		const data = {};
		const rulesArray = ['name-string', 'age-number'];
		expect(isInValiData(rulesArray, data)).toBe("name is required");
	});

	it('should handle unexpected data types', () => {
		const data = { name: 123, age: 'thirty' };
		const rulesArray = ['name-string', 'age-number'];
		expect(isInValiData(rulesArray, data)).toBe("name must be a string");
	});
});
