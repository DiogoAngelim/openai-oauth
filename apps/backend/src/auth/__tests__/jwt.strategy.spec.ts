import 'jest';
import { JwtStrategy } from '../jwt.strategy';
import { AuthService } from '../auth.service';

describe('JwtStrategy', () => {
  it('should be defined', () => {
    expect(JwtStrategy).toBeDefined();
  });
  it('should use JWT_SECRET if set', () => {
    process.env.JWT_SECRET = 'testsecret';
    const authService = { validateUserFromJwt: jest.fn() } as any;
    const strategy = new JwtStrategy(authService);
    expect(strategy).toBeDefined();
    expect(strategy.secretOrKey).toBe('testsecret');
  });
  it('should fallback to random secret if JWT_SECRET not set', () => {
    delete process.env.JWT_SECRET;
    const authService = { validateUserFromJwt: jest.fn() } as any;
    const strategy = new JwtStrategy(authService);
    expect(strategy).toBeDefined();
    expect(typeof strategy.secretOrKey).toBe('string');
    expect(strategy.secretOrKey.length).toBeGreaterThan(0);
  });
});
