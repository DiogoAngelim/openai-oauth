import { UnauthorizedException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// TODO: Replace with the actual Drizzle client import used in your project.
// For example, if you use a Drizzle client instance:

interface Membership {
  userId: string
  organizationId: string
  role: string
  [key: string]: unknown
}

function normalizeMembership (m: any): Membership {
  return {
    userId: typeof m.userId === 'string' ? m.userId : (m.userId ?? '').toString(),
    organizationId: typeof m.organizationId === 'string' ? m.organizationId : (m.organizationId ?? '').toString(),
    role: typeof m.role === 'string' ? m.role : (m.role ?? '').toString(),
    ...m
  }
}

function assertValidMembership (m: unknown): asserts m is Membership {
  const mem = normalizeMembership(m)
  if (!mem.userId) throw new UnauthorizedException('Membership userId must be a non-empty string')
  if (!mem.organizationId) throw new UnauthorizedException('Membership organizationId must be a non-empty string')
  if (!mem.role || mem.role.trim() === '') throw new UnauthorizedException('Membership role must be a non-empty string')
  if (!['OWNER', 'ADMIN', 'MEMBER'].includes(mem.role)) {
    mem.role = ''
  }
}

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService,
    // Replace 'any' with the actual type of your Drizzle client/instance if available
    private readonly drizzle: any
  ) { }

  async generateTokens (
    user: { id: string, email: string, name?: string | null, image?: string | null, createdAt?: Date, updatedAt?: Date },
    organizationId: string,
    role: string
  ): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      organizationId,
      role
    }

    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' })
    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d' })

    return { accessToken, refreshToken }
  }

  // Add other authentication methods as needed
}
