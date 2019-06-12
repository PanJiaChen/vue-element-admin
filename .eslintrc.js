module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },

  plugins: [
    "vue",
    "@typescript-eslint",
    "jsdoc",
    "eslint-comments",
    "prettier"
  ],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

    "prettier/prettier": ["error"]
  },
  extends: ["plugin:vue/essential", "prettier"] // activate vue related rules
  // extends: [
  //   "eslint:recommended",
  //   "plugin:vue/recommended",
  //   "plugin:vue/base",
  //   "@vue/standard",
  //   "@vue/typescript",
  //   "plugin:prettier/recommended"
  // ]
};
