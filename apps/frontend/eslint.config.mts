import * as js from "@eslint/js";
import * as globals from 'globals';
import tseslint from "typescript-eslint";
// eslint-plugin-react is a CommonJS module, so use require
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginReact = require("eslint-plugin-react");
import json from "@eslint/json";
import jsonParser from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
// Import JSONC parser for .json5 support
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsoncParser = require("jsonc-eslint-parser");

export default defineConfig([
  {
    ignores: [
      ".next",
      "node_modules",
      "dist"
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    ...tseslint.configs.recommended,
  },
  // ...existing code...
  ...pluginReact.configs.flat.recommended,
  // ...existing code...
  {
    files: ["**/*.json"],
    plugins: { json },
    languageOptions: { parser: jsonParser },
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    languageOptions: { parser: jsoncParser },
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.json5"],
    plugins: { json },
    languageOptions: { parser: jsoncParser },
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    extends: ["markdown/recommended"],
  },
  {
]);