import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import crypto from 'crypto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public readonly secretOrKey: string
  constructor (private readonly authService: AuthService) {
    const secret = typeof process.env.JWT_SECRET === 'string' && process.env.JWT_SECRET.trim().length > 0
      ? process.env.JWT_SECRET
      : crypto.randomBytes(32).toString('hex')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret
    })
    this.secretOrKey = secret
  }

  async validate (payload: { sub: string }): Promise<{ id: string, email?: string } | null> {
    return this.authService.validateUserFromJwt(payload)
  }
}
