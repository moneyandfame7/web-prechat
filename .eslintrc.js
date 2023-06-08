// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  globals: {
    __PATH_PREFIX__: true
  },
  extends: [`react-app`, 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'unused-imports'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-console': 'error',
        'no-return-await': 'error',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        'react/no-unused-state': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-extra-semi': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-vars': 'error',
        'react/jsx-uses-react': 'error'
      }
    }
  ]
})
