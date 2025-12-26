import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '../prisma';
import { randomUUID } from 'crypto';




@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly _prisma: any
  ) { }

  async validateOAuthLogin(
    profile: { emails: { value: string }[]; displayName: string; photos?: { value: string }[] }
  ): Promise<any> {
    const prismaClient = this._prisma ?? prisma;
    let user: any | null = await prismaClient.user.findUnique({ where: { email: profile.emails[0].value } });
    if (user === null) {
      user = await prismaClient.user.create({
        data: {
          email: profile.emails[0].value,
          name: profile.displayName,
          image: Array.isArray(profile.photos) && profile.photos.length > 0 && typeof profile.photos[0].value === 'string' && profile.photos[0].value.length > 0 ? profile.photos[0].value : undefined,
        },
      });
      // Auto-create org and membership
      if (!user || !user.id) throw new UnauthorizedException('User creation failed');
      const org = await prismaClient.organization.create({
        data: {
          name: `${profile.displayName}'s Org`,
          subscriptionPlanId: 'free', // Set default plan id
          memberships: {
            create: {
              userId: user.id,
              role: 'OWNER',
            },
          },
        },
        include: { memberships: true },
      });
      return { user, org, membership: org.memberships[0] };
    }
    // Find membership/org
    const membership = await prismaClient.membership.findFirst({ where: { userId: user.id }, include: { organization: true } });
    if (membership == null) throw new UnauthorizedException('No organization membership found');
    return { user, org: membership.organization, membership };
  }

  async generateTokens(
    user: any,
    orgId: string,
    role: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, orgId, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = randomUUID();
    const prismaClient = this._prisma ?? prisma;
    await prismaClient.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      },
    });
    return { accessToken, refreshToken };
  }

  async validateUserFromJwt(payload: { sub: string }): Promise<any | null> {
    const prismaClient = this._prisma ?? prisma;
    return prismaClient.user.findUnique({ where: { id: payload.sub } });
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const prismaClient = this._prisma ?? prisma;
    const token = await prismaClient.refreshToken.findUnique({ where: { token: refreshToken }, include: { user: true } });
    if (token == null || token.expiresAt == null || token.expiresAt < new Date()) throw new UnauthorizedException('Invalid refresh token');
    // Find membership/org
    const membership = await prismaClient.membership.findFirst({ where: { userId: token.userId }, include: { organization: true } });
    if (membership == null) throw new UnauthorizedException('No organization membership found');
    return this.generateTokens(token.user, membership.organizationId, membership.role);
  }
}
