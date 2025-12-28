import Sentry from '../sentry'

describe('Sentry', () => {
  it('should be a module', () => {
    expect(typeof Sentry).toBe('object')
  })

  it('should use the mock Sentry implementation in test env', () => {
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      configurable: true
    })
    expect(typeof Sentry.init).toBe('function')
    expect(typeof Sentry.captureException).toBe('function')
    expect(typeof Sentry.captureMessage).toBe('function')
    expect(typeof Sentry.withScope).toBe('function')
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true
    })
  })

  it('should call withScope callback if provided', () => {
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      configurable: true
    })
    const fn = jest.fn()
    Sentry.withScope(fn)
    expect(fn).toHaveBeenCalled()
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true
    })
  })

  it('should not throw when calling mock methods', () => {
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      configurable: true
    })
    expect(() => Sentry.init()).not.toThrow()
    expect(() => Sentry.captureException('err')).not.toThrow()
    expect(() => Sentry.captureMessage('msg')).not.toThrow()
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true
    })
  })

  it('should initialize real Sentry when not in test env (default export present)', async () => {
    jest.resetModules()
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      configurable: true
    })
    const mockInit = jest.fn()
    const mockSentry = { init: mockInit }
    jest.doMock('@sentry/node', () => ({
      __esModule: true,
      default: mockSentry
    }))
    const Sentry = (await import('../sentry')).default
    expect(mockInit).toHaveBeenCalledWith({
      dsn: process.env.SENTRY_DSN,
      environment: 'production',
      tracesSampleRate: 0.2
    })
    expect(Sentry).toBe(mockSentry)
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true
    })
    jest.resetModules()
    jest.dontMock('@sentry/node')
  })

  it('should initialize real Sentry when not in test env (no default export)', async () => {
    jest.resetModules()
    const originalNodeEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      configurable: true
    })
    const mockInit = jest.fn()
    const mockSentry = { init: mockInit }
    jest.doMock('@sentry/node', () => mockSentry)
    const Sentry = (await import('../sentry')).default
    expect(mockInit).toHaveBeenCalledWith({
      dsn: process.env.SENTRY_DSN,
      environment: 'production',
      tracesSampleRate: 0.2
    })
    expect(Sentry).toBe(mockSentry)
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true
    })
    jest.resetModules()
    jest.dontMock('@sentry/node')
  })
})
