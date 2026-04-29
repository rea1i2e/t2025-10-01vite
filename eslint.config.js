import js from "@eslint/js";
import globals from "globals";

/** @typedef {import("eslint").Linter.Config[]} FlatConfig */
/** @type {FlatConfig} */
export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "src/.vite/**",
      "src/.img/**",
      "coverage/**",
      "**/*.min.js",
      "**/*.html",
      "**/*.ejs",
    ],
  },
  js.configs.recommended,
  // アプリケーション／ブラウザ向け JS（Vanilla）
  {
    files: ["src/assets/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  // Node で実行するスクリプト
  {
    files: ["scripts/**/*.{js,mjs}", "raw/**/*.{js,mjs}", "vite.config.js", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  // config はブラウザ・Node 両方の識別子がありうるため緩め
  {
    files: ["config/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];
