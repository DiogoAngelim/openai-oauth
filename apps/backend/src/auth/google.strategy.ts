import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

export const isGoogleStrategyEnabled = !!process.env.GOOGLE_CLIENT_ID;

let GoogleStrategyImpl: any;
if (isGoogleStrategyEnabled) {
  @Injectable()
  class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
      super({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
        scope: ['email', 'profile'],
        passReqToCallback: false,
      });
    }

    async validate(_accessToken: string, _refreshToken: string, profile: { emails: { value: string }[]; displayName: string; photos?: { value: string }[] }, done: VerifyCallback): Promise<void> {
      const result = await this.authService.validateOAuthLogin(profile);
      done(null, result);
    }
  }
  GoogleStrategyImpl = GoogleStrategy;
} else {
  @Injectable()
  class DummyGoogleStrategy {
    // No-op
  }
  GoogleStrategyImpl = DummyGoogleStrategy;
}

export { GoogleStrategyImpl as GoogleStrategy };
