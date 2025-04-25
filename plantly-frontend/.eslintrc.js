module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'prettier'
    ],
    rules: {
        'indent': ['error', 2],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'jsx-quotes': ['error', 'prefer-single'],
        'semi': ['error', 'always'],
        'react/react-in-jsx-scope': 'off',
        'prettier/prettier': 'error'
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};