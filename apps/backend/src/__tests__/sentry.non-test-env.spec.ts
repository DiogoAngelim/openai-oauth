
describe('Sentry (non-test env)', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NODE_ENV: 'production', SENTRY_DSN: 'dummy' };
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should require @sentry/node and call init', async () => {
    const sentryNode = { init: jest.fn() };
    jest.doMock('@sentry/node', () => sentryNode, { virtual: true });
    const sentry = await import('../sentry');
    expect(sentryNode.init).toHaveBeenCalledWith({
      dsn: 'dummy',
      environment: 'production',
      tracesSampleRate: 0.2
    });
    // Jest's doMock with require returns a module with .default
    expect(sentry.default || sentry).toBe(sentryNode);
  });
});
