import NaomisConfig from '@nhcarrigan/eslint-config';

export default [
  ...NaomisConfig,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.angular/**',
      'src/app/generated/**',
    ],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json'],
      },
    },
  },
];
