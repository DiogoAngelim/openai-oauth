module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/src/__tests__', '<rootDir>/__tests__'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.spec.ts',
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/src/**/__tests__/*.spec.ts',
    '<rootDir>/src/**/__tests__/*.test.ts',
    '<rootDir>/__tests__/**/*.spec.ts',
    '<rootDir>/__tests__/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
  ],
  transform: {
    // Use ts-jest for controller files to support parameter decorators
    '^.+\\.(controller|module)\\.ts$': 'ts-jest',
    // Use babel-jest for all other files
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['/node_modules/'],
};