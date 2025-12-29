// eslint.config.js
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const tsconfigRootDir = new URL(".", import.meta.url).pathname;

const baseRules = {
  "react/react-in-jsx-scope": "off",
  "react/jsx-uses-react": "off",
  "react/prop-types": "off",
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",

  "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
  "eol-last": ["error", "always"],

  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "object", "type"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
      pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
      pathGroupsExcludedImportTypes: ["builtin"],
    },
  ],
  "import/no-duplicates": "error",
  "import/newline-after-import": "error",
};

export default [
  {
    ignores: ["dist/**", "build/**", "coverage/**", "node_modules/**"],
  },

  // JS / config files (NO typed linting)
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...baseRules,
    },
  },

  // TS / TSX (WITH typed linting)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
        },
      },
    },
    rules: {
      ...baseRules,

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
    },
  },

  // Turn off rules that conflict with Prettier
  prettierConfig,
];
