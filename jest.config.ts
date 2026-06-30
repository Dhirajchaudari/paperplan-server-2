import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testMatch: ['**/test/**/*.test.ts', '**/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};

export default config;
