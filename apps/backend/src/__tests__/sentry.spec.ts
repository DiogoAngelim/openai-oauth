import * as SentryLib from '../sentry';

describe('Sentry', () => {
  it('should be defined', () => {
    expect(SentryLib).toBeDefined();
  });
  it('should have init method', () => {
    expect(typeof SentryLib.init).toBe('function');
  });
});
