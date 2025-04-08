export default {
	verbose: true,
	preset: "ts-jest",
	testEnvironment: "node",
	modulePathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
	],
	testPathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
	],
}
