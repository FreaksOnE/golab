// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaVersion: 6,
    ecmaFeatures: {
      arrowFunctions: true,
      binaryLiterals: true,
      blockBindings: true,
      classes: true
    }
  },
  env: {
	browser: true,
	es6: true,
    node: true
  },

  extends: ["eslint:recommended", "plugin:vue/essential"],


  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  // required to lint *.vue files
  plugins: ["vue"],

  
  // add your custom rules here
  rules: {
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-console": 0,
    "comma-dangle": ["error", "always"],
    "func-call-spacing": ["error", "never"],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true,
        mode: "strict"
      }
    ],
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false
      }
    ],
    "prefer-arrow-callback": ["warn", { allowNamedFunctions: false }],
    "vue/no-parsing-error": [0, {
      "abrupt-closing-of-empty-comment": true,
      "absence-of-digits-in-numeric-character-reference": true,
      "cdata-in-html-content": true,
      "character-reference-outside-unicode-range": true,
      "control-character-in-input-stream": true,
      "control-character-reference": true,
      "eof-before-tag-name": true,
      "eof-in-cdata": true,
      "eof-in-comment": true,
      "eof-in-tag": true,
      "incorrectly-closed-comment": true,
      "incorrectly-opened-comment": true,
      "invalid-first-character-of-tag-name": true,
      "missing-attribute-value": true,
      "missing-end-tag-name": true,
      "missing-semicolon-after-character-reference": true,
      "missing-whitespace-between-attributes": true,
      "nested-comment": true,
      "noncharacter-character-reference": true,
      "noncharacter-in-input-stream": true,
      "null-character-reference": true,
      "surrogate-character-reference": true,
      "surrogate-in-input-stream": true,
      "unexpected-character-in-attribute-name": true,
      "unexpected-character-in-unquoted-attribute-value": true,
      "unexpected-equals-sign-before-attribute-name": true,
      "unexpected-null-character": true,
      "unexpected-question-mark-instead-of-tag-name": true,
      "unexpected-solidus-in-tag": true,
      "unknown-named-character-reference": true,
      "end-tag-with-attributes": true,
      "duplicate-attribute": true,
      "end-tag-with-trailing-solidus": true,
      "non-void-html-element-start-tag-with-trailing-solidus": false,
      "x-invalid-end-tag": true,
      "x-invalid-namespace": true
    }]
  }
};
