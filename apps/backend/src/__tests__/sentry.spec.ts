import Sentry from '../sentry'

describe('Sentry', () => {
  it('should be a module', () => {
    expect(typeof Sentry).toBe('object')
  })

  it('should use the mock Sentry implementation in test env', () => {
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', configurable: true })
    expect(typeof Sentry.init).toBe('function')
    expect(typeof Sentry.captureException).toBe('function')
    expect(typeof Sentry.captureMessage).toBe('function')
    expect(typeof Sentry.withScope).toBe('function')
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, configurable: true })
  })

  it('should call withScope callback if provided', () => {
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', configurable: true })
    const fn = jest.fn()
    Sentry.withScope(fn)
    expect(fn).toHaveBeenCalled()
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, configurable: true })
  })

  it('should not throw when calling mock methods', () => {
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', configurable: true })
    expect(() => Sentry.init()).not.toThrow()
    expect(() => Sentry.captureException('err')).not.toThrow()
    expect(() => Sentry.captureMessage('msg')).not.toThrow()
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, configurable: true })
  })
})
