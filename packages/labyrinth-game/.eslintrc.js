/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@shared/eslint-config/index.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
  },
};
