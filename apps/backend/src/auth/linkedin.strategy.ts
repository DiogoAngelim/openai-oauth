import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      callbackURL: process.env.BACKEND_URL + '/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { emails: { value: string }[]; displayName: string; photos?: { value: string }[] },
    done: (err: Error | null, result?: any) => void
  ): Promise<void> {
    const result = await this.authService.validateOAuthLogin(profile);
    done(null, result);
  }
}
