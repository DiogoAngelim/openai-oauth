import '@testing-library/jest-dom'

// Extend Jest's expect with jest-dom matchers for TypeScript
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<T, R> { }
  }
  // For expect(...).toBeInTheDocument(), etc.
  // If using Vitest, use 'vitest' instead of 'jest'
}
