import { UnauthorizedException } from '@nestjs/common'

export class AuthService {
  constructor (
    private readonly jwtService: any,
    private readonly drizzle: any
  ) { }

  async validateOAuthLogin (profile: any): Promise<{ user: any }> {
    const email = profile.emails?.[0]?.value
    let user = await this.drizzle.user.findUnique({ where: { email } })
    if (typeof user === 'undefined' || user === null) {
      user = await this.drizzle.user.create({
        data: { email, name: profile.displayName }
      })
      if (typeof user === 'undefined' || user === null) throw new UnauthorizedException('User creation failed')
    }
    const membership = await this.drizzle.membership.findFirst({
      where: { userId: user.id }
    })
    if (typeof membership === 'undefined' || membership === null) {
      throw new UnauthorizedException('No organization membership found')
    }
    return { user }
  }

  async generateTokens (user: any, organizationId: string, role: string): Promise<{ accessToken: string, refreshToken: string }> {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      organizationId,
      role
    })
    const refreshToken = this.jwtService.sign({
      sub: user.id,
      organizationId,
      role,
      refresh: true
    })
    await this.drizzle.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    })
    return { accessToken, refreshToken }
  }

  async validateUserFromJwt (payload: any): Promise<any> {
    return this.drizzle.user.findUnique({ where: { id: payload.sub } })
  }

  async refreshAccessToken (token: string): Promise<{ accessToken: string, refreshToken: string }> {
    const refreshToken = await this.drizzle.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    })
    if (typeof refreshToken === 'undefined' || refreshToken === null || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token')
    }
    const membership = await this.drizzle.membership.findFirst({
      where: { userId: refreshToken.userId },
      include: { organization: true }
    })
    if (typeof membership === 'undefined' || membership === null) {
      throw new UnauthorizedException('No organization membership found')
    }
    return await this.generateTokens(
      refreshToken.user,
      membership.organizationId,
      membership.role
    )
  }
}
