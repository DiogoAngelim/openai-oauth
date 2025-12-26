import { Controller, Get, Req, Res, UseGuards, Post, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request as ExpressRequest } from 'express';

// Extend Express Request to include user property
interface AuthenticatedRequest extends ExpressRequest {
  user?: any;
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
    if (!req.user || typeof req.user.user !== 'object' || typeof req.user.org !== 'object' || typeof req.user.membership !== 'object') {
      throw new UnauthorizedException('Invalid user payload');
    }
    const { user, org, membership } = req.user;
    const tokens = await this.authService.generateTokens(user, org.id, membership.role);
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 30 });
    res.json({ accessToken: tokens.accessToken, user, org, role: membership.role });
  }

  @Post('refresh')
  async refresh(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    let refreshToken: string | undefined = undefined;
    if (
      req.cookies && typeof req.cookies === 'object' &&
      typeof req.cookies.refresh_token === 'string'
    ) {
      refreshToken = req.cookies.refresh_token;
    } else if (
      req.body && typeof req.body === 'object' &&
      typeof req.body.refreshToken === 'string'
    ) {
      refreshToken = req.body.refreshToken;
    }
    if (!refreshToken || refreshToken.trim().length === 0) {
      throw new UnauthorizedException('No refresh token');
    }
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    res.json({ accessToken: tokens.accessToken });
  }
}
