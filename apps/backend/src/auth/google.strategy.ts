// This file should define and export the GoogleStrategy and isGoogleStrategyEnabled, not contain tests.

import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

export const isGoogleStrategyEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  // @ts-expect-error
  require("passport-google-oauth20").Strategy,
  "google",
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    try {
      const result = await this.authService.validateOAuthLogin(profile);
      done(null, result.user);
    } catch (err) {
      done(err);
    }
  }
}
