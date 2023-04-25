module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: `react-app`,
  //we are using prettier, so eslint should not be doing any cosmetic changes
  rules: {
    "no-console": "off",
    strict: ["error", "global"],
    curly: "warn",
    semi: ["error", "never"],
  },
}
