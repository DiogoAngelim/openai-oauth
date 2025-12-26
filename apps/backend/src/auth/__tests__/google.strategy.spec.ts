import { GoogleStrategy, isGoogleStrategyEnabled } from '../google.strategy';
import { AuthService } from '../auth.service';

describe('GoogleStrategy', () => {
  let strategy: any;
  let authService: AuthService;

  beforeEach(() => {
    authService = { validateOAuthLogin: jest.fn().mockResolvedValue('user') } as any;
    strategy = new GoogleStrategy(authService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  if (isGoogleStrategyEnabled) {
    it('should call validateOAuthLogin and done', async () => {
      const profile = { emails: [{ value: 'test@example.com' }], displayName: 'Test User' };
      const done = jest.fn();
      await strategy.validate('token', 'refresh', profile, done);
      expect(authService.validateOAuthLogin).toHaveBeenCalledWith(profile);
      expect(done).toHaveBeenCalledWith(null, 'user');
    });
  } else {
    it('should be a dummy strategy when disabled', () => {
      expect(strategy).toBeInstanceOf(Object);
    });
  }
});
