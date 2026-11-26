const rules = {
  "no-undef": "error",
  "no-unreachable": "error",
  "no-unused-vars": "error",
  "no-var": "error",
  "prefer-const": "error"
};

export default [
  {
    files: ["assets/clipboard-recovery.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        document: "readonly",
        Element: "readonly",
        HTMLImageElement: "readonly",
        MutationObserver: "readonly",
        navigator: "readonly",
        NodeFilter: "readonly",
        URL: "readonly",
        window: "readonly"
      }
    },
    rules
  },
  {
    files: ["tests/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        setImmediate: "readonly"
      }
    },
    rules
  },
  {
    files: ["eslint.config.mjs"],
    rules
  }
];
