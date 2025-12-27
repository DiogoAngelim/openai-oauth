import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

// Workaround: define a minimal PrismaClient type for testing
type PrismaClient = any;


jest.mock('../prisma', () => {
  return {
    prisma: {
      user: { findUnique: jest.fn(), create: jest.fn() },
      organization: { create: jest.fn(), findUnique: jest.fn() },
      membership: { findFirst: jest.fn() },
      refreshToken: { create: jest.fn(), findUnique: jest.fn() }
    }
  };
});

// Expanded test suite for AuthController (see previous patch)
describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let res: jest.Mocked<Response>;
  let req: jest.Mocked<Request>;

  beforeEach(() => {
    // Mock JwtService
    const jwtService = {
      sign: jest.fn(() => 'signed-jwt'),
    } as unknown as JwtService;
    // Mock PrismaClient
    const prisma = {} as jest.Mocked<PrismaClient>;
    authService = new AuthService(jwtService, prisma);
    // Mock methods on AuthService
    jest.spyOn(authService, 'generateTokens').mockResolvedValue({ accessToken: 'jwt', refreshToken: 'rtok' });
    jest.spyOn(authService, 'refreshAccessToken').mockResolvedValue({ accessToken: 'jwt', refreshToken: 'rtok' });
    controller = new AuthController(authService);
    // Proper Response mock
    res = {
      cookie: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      end: jest.fn(),
      send: jest.fn(),
    } as unknown as jest.Mocked<Response>;
    // Proper Request mock
    req = {
      user: undefined,
      cookies: undefined,
      body: undefined,
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
    } as unknown as jest.Mocked<Request>;
  });

  it('should be defined', () => {
    expect(AuthController).toBeDefined();
  });

  describe('googleAuthCallback', () => {
    it('should return tokens and set cookie if user is valid', async () => {
      const user = {
        id: 'u1',
        image: null,
        name: null,
        email: '',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      };
      const org = { id: 'o1' };
      const membership = { role: 'OWNER' };
      req.user = { user, org, membership };
      (authService.generateTokens as jest.Mock).mockResolvedValueOnce({ accessToken: 'jwt', refreshToken: 'rtok' });
      await controller.googleAuthCallback(req, res);
      expect(authService.generateTokens).toHaveBeenCalledWith(user, org.id, membership.role);
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'rtok', expect.objectContaining({ httpOnly: true }));
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'jwt', user, org, role: 'OWNER' });
    });
    it('should throw UnauthorizedException if req.user is missing', async () => {
      req.user = undefined;
      await expect(controller.googleAuthCallback(req, res)).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
    it('should throw UnauthorizedException if req.user is missing fields', async () => {
      req.user = { user: {}, org: undefined, membership: undefined };
      await expect(controller.googleAuthCallback(req, res)).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
  });

  describe('refresh', () => {
    it('should refresh using cookie', async () => {
      req.cookies = { refresh_token: 'cookie-token' };
      (authService.refreshAccessToken as jest.Mock).mockResolvedValueOnce({ accessToken: 'jwt', refreshToken: 'rtok' });
      await controller.refresh(req, res);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith('cookie-token');
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'jwt' });
    });
    it('should refresh using body', async () => {
      req.body = { refreshToken: 'body-token' };
      (authService.refreshAccessToken as jest.Mock).mockResolvedValueOnce({ accessToken: 'jwt', refreshToken: 'rtok' });
      await controller.refresh(req, res);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith('body-token');
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'jwt' });
    });
    it('should throw UnauthorizedException if no token', async () => {
      req.cookies = {};
      req.body = {};
      await expect(controller.refresh(req, res)).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
    it('should throw UnauthorizedException if token is empty', async () => {
      req.cookies = { refresh_token: '' };
      req.body = { refreshToken: '' };
      await expect(controller.refresh(req, res)).rejects.toMatchObject({ name: 'UnauthorizedException' });
    });
    it('should propagate error from authService', async () => {
      req.cookies = { refresh_token: 'bad' };
      (authService.refreshAccessToken as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      await expect(controller.refresh(req, res)).rejects.toThrow('fail');
    });
  });
});
