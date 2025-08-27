module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  // NUCLEAR BABEL DESTRUCTION - No Babel anywhere
  env: {
    browser: true,
    es6: true,
    node: true,
  },
}
