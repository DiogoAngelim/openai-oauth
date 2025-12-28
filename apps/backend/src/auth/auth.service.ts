import { UnauthorizedException } from '@nestjs/common'

export class AuthService {
  constructor(private jwtService: any, private drizzle: any) { }

  async validateOAuthLogin(profile: any) {
    const email = profile.emails?.[0]?.value
    let user = await this.drizzle.user.findUnique({ where: { email } })
    if (!user) {
      user = await this.drizzle.user.create({ data: { email, name: profile.displayName } })
      if (!user) throw new UnauthorizedException('User creation failed')
    }
    const membership = await this.drizzle.membership.findFirst({ where: { userId: user.id } })
    if (!membership) throw new UnauthorizedException('No organization membership found')
    return { user }
  }

  async generateTokens(user: any, organizationId: string, role: string) {
    const accessToken = this.jwtService.sign({ sub: user.id, organizationId, role })
    const refreshToken = this.jwtService.sign({ sub: user.id, organizationId, role, refresh: true })
    await this.drizzle.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    })
    return { accessToken, refreshToken }
  }

  async validateUserFromJwt(payload: any) {
    return await this.drizzle.user.findUnique({ where: { id: payload.sub } })
  }

  async refreshAccessToken(token: string) {
    const refreshToken = await this.drizzle.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    })
    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token')
    }
    const membership = await this.drizzle.membership.findFirst({
      where: { userId: refreshToken.userId },
      include: { organization: true }
    })
    if (!membership) throw new UnauthorizedException('No organization membership found')
    return this.generateTokens(refreshToken.user, membership.organizationId, membership.role)
  }
}