import 'reflect-metadata';
import 'jest';
import { AuthService } from '../auth/auth.service';

const prisma = {
  user: { findUnique: jest.fn(), create: jest.fn() },
  organization: { create: jest.fn(), findUnique: jest.fn() },
  membership: { findFirst: jest.fn() },
  refreshToken: { create: jest.fn(), findUnique: jest.fn() },
};
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: { findUnique: jest.fn(), create: jest.fn() },
      organization: { create: jest.fn(), findUnique: jest.fn() },
      membership: { findFirst: jest.fn() },
      refreshToken: { create: jest.fn(), findUnique: jest.fn() }
    }))
  };
});
describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: any;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn((payload, options) => {
        if (options && options.expiresIn === '15m') {
          return 'signed-jwt';
        }
        return 'signed-jwt';
      })
    };
    authService = new AuthService(jwtService, prisma as any);
  });

  it('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  describe('validateOAuthLogin', () => {
    it('should create user/org/membership if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValueOnce({ id: 'user1', email: 'test@example.com', name: 'Test User' });
      prisma.organization.create.mockResolvedValueOnce({
        id: 'org1',
        name: 'Test User\'s Org',
        memberships: [{ userId: 'user1', role: 'OWNER' }]
      });
      const profile = { emails: [{ value: 'test@example.com' }], displayName: 'Test User', photos: [{ value: 'img.png' }] };
      const result = await authService.validateOAuthLogin(profile);
      expect(result.user).toMatchObject({ id: 'user1', email: 'test@example.com' });
      expect(result.org).toMatchObject({ id: 'org1', name: expect.any(String) });
      expect(result.membership).toMatchObject({ userId: 'user1', role: 'OWNER' });
    });

    it('should return user/org/membership if user exists', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user2', email: 'exists@example.com', name: 'Exists' });
      prisma.membership.findFirst.mockResolvedValueOnce({
        userId: 'user2',
        role: 'MEMBER',
        organization: { id: 'org2', name: 'Org2' }
      });
      const profile = { emails: [{ value: 'exists@example.com' }], displayName: 'Exists' };
      const result = await authService.validateOAuthLogin(profile);
      expect(result.user).toMatchObject({ id: 'user2', email: 'exists@example.com' });
      expect(result.org).toMatchObject({ id: 'org2', name: 'Org2' });
      expect(result.membership).toMatchObject({ userId: 'user2', role: 'MEMBER' });
    });

    it('should throw if no membership found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user3', email: 'noorg@example.com', name: 'NoOrg' });
      prisma.membership.findFirst.mockResolvedValueOnce(null);
      const profile = { emails: [{ value: 'noorg@example.com' }], displayName: 'NoOrg' };
      await expect(authService.validateOAuthLogin(profile)).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
  });

  describe('generateTokens', () => {
    it('should generate and return tokens', async () => {
      prisma.refreshToken.create.mockResolvedValueOnce({});
      const user = { id: 'user4' };
      const result = await authService.generateTokens(user, 'org4', 'ADMIN');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user4', orgId: 'org4', role: 'ADMIN' }, { expiresIn: '15m' });
      expect(result).toHaveProperty('accessToken', 'signed-jwt');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('validateUserFromJwt', () => {
    it('should return user if found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user5', email: 'jwt@example.com' });
      const result = await authService.validateUserFromJwt({ sub: 'user5' });
      expect(result).toMatchObject({ id: 'user5', email: 'jwt@example.com' });
    });
    it('should return null if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      const result = await authService.validateUserFromJwt({ sub: 'nouser' });
      expect(result).toBeNull();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new tokens if refresh token is valid', async () => {
      prisma.refreshToken.findUnique.mockResolvedValueOnce({
        userId: 'user6',
        expiresAt: new Date(Date.now() + 100000),
        user: { id: 'user6' }
      });
      prisma.membership.findFirst.mockResolvedValueOnce({
        userId: 'user6',
        organization: { id: 'org6' },
        role: 'MEMBER'
      });
      jest.spyOn(authService, 'generateTokens').mockResolvedValueOnce({ accessToken: 'jwt', refreshToken: 'rtok' });
      const result = await authService.refreshAccessToken('validtoken');
      expect(result).toEqual({ accessToken: 'jwt', refreshToken: 'rtok' });
    });
    it('should throw if refresh token not found', async () => {
      prisma.refreshToken.findUnique.mockResolvedValueOnce(null);
      await expect(authService.refreshAccessToken('badtoken')).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
    it('should throw if refresh token expired', async () => {
      prisma.refreshToken.findUnique.mockResolvedValueOnce({
        userId: 'user7',
        expiresAt: new Date(Date.now() - 100000),
        user: { id: 'user7' }
      });
      await expect(authService.refreshAccessToken('expiredtoken')).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
    it('should throw if no membership found', async () => {
      prisma.refreshToken.findUnique.mockResolvedValueOnce({
        userId: 'user8',
        expiresAt: new Date(Date.now() + 100000),
        user: { id: 'user8' }
      });
      prisma.membership.findFirst.mockResolvedValueOnce(null);
      await expect(authService.refreshAccessToken('nomembership')).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
  });
});
