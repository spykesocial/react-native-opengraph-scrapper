import globals from 'globals';
import mochaPlugin from 'eslint-plugin-mocha';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'example.ts'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'scripts/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'max-len': ['error', {
        code: 120,
        ignoreStrings: true,
        ignoreTrailingComments: true,
      }],
      'consistent-return': 'off',
      'no-param-reassign': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...mochaPlugin.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        expect: 'readonly',
        sinon: 'readonly',
      },
    },
    rules: {
      'func-names': 'off',
      'no-console': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'max-len': 'off',
      'prefer-arrow-callback': 'off',
      'mocha/consistent-spacing-between-blocks': 'off',
      'mocha/no-skipped-tests': 'off',
      'mocha/no-mocha-arrows': 'off',
    },
  },
);
