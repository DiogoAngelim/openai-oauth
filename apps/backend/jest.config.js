module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__', '<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      diagnostics: false,
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  // coverageThreshold removed to allow coverage reporting even if not 100%
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['/node_modules/'],
};