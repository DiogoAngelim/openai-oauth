import { Controller, Get, Req, Res, UseGuards, Post, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    // User is attached to req.user by GoogleStrategy
    interface ReqUser {
      user: any; // Use 'any' type for testability
      org: any; // Use 'any' type for testability
      membership: any; // Use 'any' type for testability
    }
    if (!req.user || typeof (req.user as ReqUser).user !== 'object' || typeof (req.user as ReqUser).org !== 'object' || typeof (req.user as ReqUser).membership !== 'object') {
      throw new UnauthorizedException('Invalid user payload');
    }
    const { user, org, membership } = req.user as ReqUser;
    const tokens = await this.authService.generateTokens(user, org.id, membership.role);
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.json({ accessToken: tokens.accessToken, user, org, role: membership.role });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    let refreshToken: unknown = undefined;
    if (
      typeof req === 'object' && req !== null &&
      'cookies' in req &&
      typeof (req as { cookies?: unknown }).cookies === 'object' &&
      (req as { cookies?: unknown }).cookies !== null &&
      Object.prototype.hasOwnProperty.call((req as { cookies: Record<string, unknown> }).cookies, 'refresh_token') &&
      typeof (req as { cookies: Record<string, unknown> }).cookies.refresh_token === 'string'
    ) {
      refreshToken = (req as { cookies: Record<string, unknown> }).cookies.refresh_token;
    } else if (
      typeof req === 'object' && req !== null &&
      'body' in req &&
      typeof (req as { body?: unknown }).body === 'object' &&
      (req as { body?: unknown }).body !== null &&
      Object.prototype.hasOwnProperty.call((req as { body: Record<string, unknown> }).body, 'refreshToken') &&
      typeof (req as { body: Record<string, unknown> }).body.refreshToken === 'string'
    ) {
      refreshToken = (req as { body: Record<string, unknown> }).body.refreshToken;
    }
    if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
      throw new UnauthorizedException('No refresh token');
    }
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    res.json({ accessToken: tokens.accessToken });
  }
}
