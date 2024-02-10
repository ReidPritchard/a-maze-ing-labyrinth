module.exports = {
  extends: [
    "eslint:recommended",
    "eslint-config-prettier",
    "plugin:typescript/recommended",
  ],
  rules: {},
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
