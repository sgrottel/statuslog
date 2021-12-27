export default {
	moduleFileExtensions: ["ts", "tsx", "js"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	testMatch: [
		"**/tests/**/*.spec.ts",
		"**/tests/**/*.test.ts",
	],
	testEnvironment: "node",
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90
		}
	}
};
