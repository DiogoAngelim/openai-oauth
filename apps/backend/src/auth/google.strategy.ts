import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

export const isGoogleStrategyEnabled = typeof process.env.GOOGLE_CLIENT_ID === 'string' && process.env.GOOGLE_CLIENT_ID.trim().length > 0;


import { Provider } from '@nestjs/common';

let GoogleStrategy: Provider;
if (isGoogleStrategyEnabled) {
  @Injectable()
  class GoogleStrategyClass extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
      super({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
        scope: ['email', 'profile'],
        passReqToCallback: false,
      });
    }

    async validate(
      _accessToken: string,
      _refreshToken: string,
      profile: { emails: { value: string }[]; displayName: string; photos?: { value: string }[] },
      done: (err: Error | null, result?: { id?: string; email?: string; name?: string } | null) => void
    ): Promise<void> {
      const { user } = await this.authService.validateOAuthLogin(profile);
      done(null, { id: user.id ?? undefined, email: user.email ?? undefined, name: user.name ?? undefined });
    }
  }
  GoogleStrategy = GoogleStrategyClass;
} else {
  @Injectable()
  class DummyGoogleStrategy { }
  GoogleStrategy = DummyGoogleStrategy;
}

export { GoogleStrategy };
