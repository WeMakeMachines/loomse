/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    ignorePatterns: ["dist/"],
    root: true,
    rules: {
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-extra-boolean-cast": "off",
        "no-mixed-spaces-and-tabs": "off",
        "no-prototype-builtins": "off"
    }
};