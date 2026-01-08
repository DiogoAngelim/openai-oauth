module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.spec.js',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.spec.tsx',
    '<rootDir>/src/**/*.test.tsx',
    '<rootDir>/src/**/*.spec.jsx',
    '<rootDir>/src/**/*.test.jsx'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverage: true
  // ...rest of config...
}
