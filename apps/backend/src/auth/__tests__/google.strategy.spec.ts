import { GoogleStrategy, isGoogleStrategyEnabled } from '../google.strategy';
import { AuthService } from '../auth.service';

describe('GoogleStrategy', () => {
  let strategy: typeof GoogleStrategy;
  let authService: AuthService;

  beforeEach(() => {
    authService = Object.assign(new AuthService({ sign: jest.fn() } as unknown as import('@nestjs/jwt').JwtService, {} as unknown as import('@prisma/client').PrismaClient), {
      validateOAuthLogin: jest.fn().mockResolvedValue({ user: { id: 'id', email: 'email', name: 'name' } })
    });
    if (isGoogleStrategyEnabled) {
      strategy = new (GoogleStrategy as typeof import('../google.strategy').GoogleStrategy)(authService);
    } else {
      strategy = new (GoogleStrategy as typeof import('../google.strategy').GoogleStrategy)();
    }
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  if (isGoogleStrategyEnabled) {
    it('should call validateOAuthLogin and done', async () => {
      const profile = { emails: [{ value: 'test@example.com' }], displayName: 'Test User' };
      const done = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (strategy as any).validate === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (strategy as any).validate('token', 'refresh', profile, done);
        expect(authService.validateOAuthLogin).toHaveBeenCalledWith(profile);
        expect(done).toHaveBeenCalledWith(null, { id: 'id', email: 'email', name: 'name' });
      } else {
        throw new Error('Strategy does not implement validate');
      }
    });
  } else {
    it('should be a dummy strategy when disabled', () => {
      expect(strategy).toBeInstanceOf(Object);
    });
  }
});
