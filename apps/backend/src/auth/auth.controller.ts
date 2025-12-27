import { Controller, Get, Req, Res, UseGuards, Post, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request as ExpressRequest } from 'express';

// Extend Express Request to include user property
interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    user?: { id?: string };
    org?: { id?: string };
    membership?: { role?: string };
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    // User is attached to req.user by GoogleStrategy
    if (
      req.user === undefined || req.user === null ||
      req.user.user === undefined || req.user.user === null || typeof req.user.user !== 'object' ||
      req.user.org === undefined || req.user.org === null || typeof req.user.org !== 'object' ||
      req.user.membership === undefined || req.user.membership === null || typeof req.user.membership !== 'object'
    ) {
      throw new UnauthorizedException('Invalid user payload');
    }
    const { user, org, membership } = req.user;
    // Ensure user has all required fields for generateTokens
    // Ensure all required user fields are present
    const userObj = user as User;
    const userForToken = {
      id: userObj.id ?? '',
      image: userObj.image ?? null,
      name: userObj.name ?? null,
      email: userObj.email ?? '',
      createdAt: userObj.createdAt ?? new Date(),
      updatedAt: userObj.updatedAt ?? new Date(),
    };
    const tokens = await this.authService.generateTokens(userForToken, org.id ?? '', membership.role ?? '');
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.json({ accessToken: tokens.accessToken, user, org, role: membership.role });
  }

  @Post('refresh')
  async refresh(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    let refreshToken: string | undefined = undefined;
    if (
      req.cookies !== undefined && req.cookies !== null && typeof req.cookies === 'object' &&
      req.cookies.refresh_token !== undefined && req.cookies.refresh_token !== null && typeof req.cookies.refresh_token === 'string'
    ) {
      refreshToken = req.cookies.refresh_token;
    } else if (
      req.body !== undefined && req.body !== null && typeof req.body === 'object' &&
      req.body.refreshToken !== undefined && req.body.refreshToken !== null && typeof req.body.refreshToken === 'string'
    ) {
      refreshToken = req.body.refreshToken;
    }
    if (refreshToken === undefined || refreshToken === null || typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
      throw new UnauthorizedException('No refresh token');
    }
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    res.json({ accessToken: tokens.accessToken });
  }
}
