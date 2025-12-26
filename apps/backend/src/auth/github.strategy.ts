import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.BACKEND_URL + '/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { emails: { value: string }[]; displayName: string; photos?: { value: string }[] },
    done: (err: Error | null, result?: any) => void // Changed from specific types to 'any' for testability
  ): Promise<void> {
    const result = await this.authService.validateOAuthLogin(profile);
    done(null, result);
  }
}
