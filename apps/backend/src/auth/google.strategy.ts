// This file should define and export the GoogleStrategy and isGoogleStrategyEnabled, not contain tests.

// Set dummy values for all required environment variables if not set
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy as GoogleOAuthStrategy } from 'passport-google-oauth20';

process.env.GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ?? 'dummy_google_client_id'
process.env.GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET ?? 'dummy_google_client_secret'
process.env.GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ??
  'http://localhost:3000/auth/google/callback'
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'dummy_database_url'
process.env.REDIS_URL = process.env.REDIS_URL ?? 'dummy_redis_url'
process.env.SENTRY_DSN = process.env.SENTRY_DSN ?? 'dummy_sentry_dsn'
process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000'
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'dummy_jwt_secret'
process.env.GITHUB_CLIENT_ID =
  process.env.GITHUB_CLIENT_ID ?? 'dummy_github_id'
process.env.GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET ?? 'dummy_github_secret'
process.env.BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000'
process.env.LINKEDIN_CLIENT_ID =
  process.env.LINKEDIN_CLIENT_ID ?? 'dummy_linkedin_id'
process.env.LINKEDIN_CLIENT_SECRET =
  process.env.LINKEDIN_CLIENT_SECRET ?? 'dummy_linkedin_secret'

export const isGoogleStrategyEnabled =
  typeof process.env.GOOGLE_CLIENT_ID === 'string' && process.env.GOOGLE_CLIENT_ID !== '' && typeof process.env.GOOGLE_CLIENT_SECRET === 'string' && process.env.GOOGLE_CLIENT_SECRET !== ''

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleOAuthStrategy,
  'google'
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile']
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void
  ): Promise<void> {
    try {
      const result = await this.authService.validateOAuthLogin(profile)
      done(null, result.user)
    } catch (err) {
      done(err)
    }
  }
}
