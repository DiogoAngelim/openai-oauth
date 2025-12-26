import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public readonly secretOrKey: string;
  constructor(private readonly authService: AuthService) {
    const secret = process.env.JWT_SECRET || require('crypto').randomBytes(32).toString('hex');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.secretOrKey = secret;
  }

  async validate(payload: { sub: string }): Promise<any> {
    return this.authService.validateUserFromJwt(payload);
  }
}
