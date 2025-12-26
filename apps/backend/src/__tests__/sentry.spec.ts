import Sentry from '../sentry';

describe('Sentry', () => {
  it('should be defined', () => {
    expect(Sentry).toBeDefined();
  });
  it('should have init method', () => {
    expect(typeof Sentry.init).toBe('function');
  });
});
