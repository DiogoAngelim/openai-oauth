import { AuthController } from '../auth/auth.controller';
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

// Expanded test suite for AuthController (see previous patch)
describe('AuthController', () => {
  let controller: any;
  let authService: any;
  let res: any;
  let req: any;

  beforeEach(() => {
    authService = {
      generateTokens: jest.fn(),
      refreshAccessToken: jest.fn()
    };
    controller = new AuthController(authService);
    res = { cookie: jest.fn(), json: jest.fn() };
    req = {};
  });

  it('should be defined', () => {
    expect(AuthController).toBeDefined();
  });

  describe('googleAuthCallback', () => {
    it('should return tokens and set cookie if user is valid', async () => {
      const user = { id: 'u1' };
      const org = { id: 'o1' };
      const membership = { role: 'OWNER' };
      req.user = { user, org, membership };
      authService.generateTokens.mockResolvedValueOnce({ accessToken: 'jwt', refreshToken: 'rtok' });
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
      authService.refreshAccessToken.mockResolvedValueOnce({ accessToken: 'jwt' });
      await controller.refresh(req, res);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith('cookie-token');
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'jwt' });
    });
    it('should refresh using body', async () => {
      req.body = { refreshToken: 'body-token' };
      authService.refreshAccessToken.mockResolvedValueOnce({ accessToken: 'jwt' });
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
      authService.refreshAccessToken.mockRejectedValueOnce(new Error('fail'));
      await expect(controller.refresh(req, res)).rejects.toThrow('fail');
    });
  });
});
