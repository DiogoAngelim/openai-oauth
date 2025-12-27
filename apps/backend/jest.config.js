module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/jest.global-setup.js',
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*.{spec,test}.{js,ts,jsx,tsx}'],
  transform: {
    '^.+\\.(controller|module)\\.ts$': 'ts-jest',
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!<rootDir>/src/main.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['/node_modules/'],
};