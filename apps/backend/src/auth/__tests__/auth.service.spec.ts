import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaMock: any;

  beforeEach(() => {
    jwtService = { sign: jest.fn().mockReturnValue('token') } as any;
    prismaMock = {
      user: { findUnique: jest.fn(), create: jest.fn() },
      organization: { create: jest.fn() },
      membership: { findFirst: jest.fn() },
      refreshToken: { create: jest.fn(), findUnique: jest.fn() }
    };
    service = new AuthService(jwtService, prismaMock);
  });

  it('should throw UnauthorizedException if user creation fails', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(null);
    await expect(service.validateOAuthLogin({ emails: [{ value: 'test@example.com' }], displayName: 'Test' })).rejects.toThrow('User creation failed');
  });

  it('should throw UnauthorizedException if no membership found', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });
    prismaMock.membership.findFirst.mockResolvedValue(null);
    await expect(service.validateOAuthLogin({ emails: [{ value: 'test@example.com' }], displayName: 'Test' })).rejects.toThrow('No organization membership found');
  });

  it('should create tokens and save refreshToken', async () => {
    prismaMock.refreshToken.create.mockResolvedValue({});
    const result = await service.generateTokens({ id: '1' }, 'org1', 'ADMIN');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(prismaMock.refreshToken.create).toHaveBeenCalled();
  });

  it('should validate user from jwt', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: '1' });
    const user = await service.validateUserFromJwt({ sub: '1' });
    expect(user).toEqual({ id: '1' });
  });

  it('should throw UnauthorizedException for invalid refresh token', async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue(null);
    await expect(service.refreshAccessToken('badtoken')).rejects.toThrow('Invalid refresh token');
  });

  it('should throw UnauthorizedException for expired refresh token', async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() - 1000), user: { id: '1' } });
    await expect(service.refreshAccessToken('expiredtoken')).rejects.toThrow('Invalid refresh token');
  });

  it('should throw UnauthorizedException for missing membership in refreshAccessToken', async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() + 1000 * 60 * 60), user: { id: '1' }, userId: '1' });
    prismaMock.membership.findFirst.mockResolvedValue(null);
    await expect(service.refreshAccessToken('token')).rejects.toThrow('No organization membership found');
  });

  it('should successfully refresh access token', async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() + 1000 * 60 * 60), user: { id: '1' }, userId: '1' });
    prismaMock.membership.findFirst.mockResolvedValue({ organizationId: 'org1', role: 'ADMIN', organization: {} });
    prismaMock.refreshToken.create.mockResolvedValue({});
    const result = await service.refreshAccessToken('token');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(prismaMock.refreshToken.create).toHaveBeenCalled();
  });
});
