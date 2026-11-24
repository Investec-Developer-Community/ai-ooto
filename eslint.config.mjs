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
    rules: {
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": "error",
      "no-var": "error",
      "prefer-const": "error"
    }
  }
];
