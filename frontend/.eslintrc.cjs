module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Node 환경을 사용할 경우 추가
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript 규칙을 위한 기본 설정 추가
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    '.lintstagedrc.cjs',
    'commitlint.config.cjs',
    'jest.config.js',
    'vite.config.js',
    'vitest.setup.js',
  ],
  parser: '@typescript-eslint/parser', // Parser를 TypeScript용으로 변경
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: ['./tsconfig.json'], // TypeScript 컴파일러 설정 파일 지정
  },
  settings: {
    react: { version: 'detect' }, // React 버전 자동 감지
  },
  plugins: [
    'react-refresh',
    'prettier',
    '@typescript-eslint', // TypeScript ESLint 플러그인 추가
  ],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // TypeScript-specific rules or override default rules
  },
};
