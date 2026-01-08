describe('Sentry (non-test env)', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV, NODE_ENV: 'production', SENTRY_DSN: 'https://publicKey@o0.ingest.sentry.io/0' }
  })
  afterEach(() => {
    process.env = OLD_ENV
  })

  it('should require @sentry/node and call init', () => {
    const sentryNode = {
      init: jest.fn(),
      captureException: jest.fn(),
      captureMessage: jest.fn(),
      withScope: jest.fn()
    }
    jest.mock('@sentry/node', () => sentryNode)
    return import('../sentry').then((sentry) => {
      expect(sentryNode.init).toHaveBeenCalledWith({
        dsn: 'https://publicKey@o0.ingest.sentry.io/0',
        environment: 'production',
        tracesSampleRate: 0.2
      })
      expect(sentry.default || sentry).toBe(sentryNode)
    })
  })
})
