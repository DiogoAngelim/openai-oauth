import 'jest';
import { JwtStrategy } from '../jwt.strategy';
import { AuthService } from '../auth.service';

describe('JwtStrategy', () => {
  it('should be defined', () => {
    expect(JwtStrategy).toBeDefined();
  });
  it('should use JWT_SECRET if set', () => {
    process.env.JWT_SECRET = 'testsecret';
    const authService = Object.assign(new AuthService({ sign: jest.fn() } as unknown as import('@nestjs/jwt').JwtService, {} as import('@prisma/client').PrismaClient), {
      validateUserFromJwt: jest.fn()
    });
    const strategy = new JwtStrategy(authService);
    expect(strategy).toBeDefined();
    expect(strategy.secretOrKey).toBe('testsecret');
  });
  it('should fallback to random secret if JWT_SECRET not set', () => {
    delete process.env.JWT_SECRET;
    const jwtService = { sign: jest.fn() } as unknown as import('@nestjs/jwt').JwtService;
    const prisma = {} as import('@prisma/client').PrismaClient;
    const authService = Object.assign(new AuthService(jwtService, prisma), {
      validateUserFromJwt: jest.fn()
    });
    const strategy = new JwtStrategy(authService);
    expect(strategy).toBeDefined();
    expect(typeof strategy.secretOrKey).toBe('string');
    expect(strategy.secretOrKey.length).toBeGreaterThan(0);
  });
});
