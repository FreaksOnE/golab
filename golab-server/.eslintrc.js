// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parserOptions: {
		parser: "babel-eslint",
		sourceType: "module",
		ecmaVersion: 6,
		ecmaFeatures: {
			arrowFunctions: true,
			binaryLiterals: true,
			blockBindings: true,
			classes: true,
		},
	},
	env: {
		browser: true,
		es6: true,
		node: true,
	},

	extends: ["eslint:recommended", "airbnb-base"],

	// add your custom rules here
	rules: {
		// allow debugger during development
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		indent: [2, "tab"],
		"no-tabs": 0,
		"no-unused-vars": ["off"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "backtick"],
		semi: ["error", "always"],
		"no-console": 0,
		"new-cap": ["off"],
		"comma-dangle": ["error", "never"],
		"func-call-spacing": ["error", "never"],
		"key-spacing": [
			"error",
			{
				beforeColon: false,
				afterColon: true,
				mode: "strict",
			},
		],
		"prefer-const": [
			"error",
			{
				destructuring: "any",
				ignoreReadBeforeAssign: false,
			},
		],
		"prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
	},
};
