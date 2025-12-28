import { AuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService
  let drizzle: any

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(() => 'signed-jwt')
    } as any
    drizzle = {
      user: {
        findUnique: jest.fn(() => ({ id: 'u1' }))
      },
      membership: {
        findFirst: jest.fn(() => ({ id: 'm1' }))
      },
      refreshToken: {
        findUnique: jest.fn(() => ({
          token: 'rtok',
          expiresAt: new Date(Date.now() + 10000)
        }))
      }
    }
    service = new AuthService(jwtService, drizzle)
  })

  it('should throw if user creation fails', async () => {
    drizzle.user.findUnique = jest.fn(() => undefined)
    drizzle.user.create = jest.fn(() => undefined)
    const profile = { emails: [{ value: 'fail@example.com' }], displayName: 'fail' }
    await expect(service.validateOAuthLogin(profile)).rejects.toThrow('User creation failed')
  })

  it('should throw if membership is undefined', async () => {
    drizzle.user.findUnique = jest.fn(() => ({ id: 'u1' }))
    drizzle.membership.findFirst = jest.fn(() => undefined)
    const profile = { emails: [{ value: 'u1@example.com' }], displayName: 'User' }
    await expect(service.validateOAuthLogin(profile)).rejects.toThrow('No organization membership found')
  })

  it('should return user if valid', async () => {
    drizzle.user.findUnique = jest.fn(() => ({ id: 'u1' }))
    drizzle.membership.findFirst = jest.fn(() => ({ id: 'm1' }))
    const profile = { emails: [{ value: 'u1@example.com' }], displayName: 'User' }
    await expect(service.validateOAuthLogin(profile)).resolves.toEqual({ user: { id: 'u1' } })
  })

  it('should throw if refreshToken is invalid', async () => {
    drizzle.refreshToken.findUnique = jest.fn(() => undefined)
    await expect(service.refreshAccessToken('bad')).rejects.toThrow('Invalid refresh token')
  })

  it('should throw if refreshToken is expired', async () => {
    drizzle.refreshToken.findUnique = jest.fn(() => ({
      token: 'rtok',
      expiresAt: new Date(Date.now() - 10000)
    }))
    await expect(service.refreshAccessToken('rtok')).rejects.toThrow('Invalid refresh token')
  })

  it('should throw if membership is missing in refreshAccessToken', async () => {
    drizzle.membership.findFirst = jest.fn(() => undefined)
    drizzle.refreshToken.findUnique = jest.fn(() => ({
      token: 'rtok',
      expiresAt: new Date(Date.now() + 10000)
    }))
    await expect(service.refreshAccessToken('rtok')).rejects.toThrow('No organization membership found')
  })

  it('should return tokens if refreshToken and membership are valid', async () => {
    drizzle.refreshToken.findUnique = jest.fn(() => ({
      token: 'rtok',
      expiresAt: new Date(Date.now() + 10000),
      userId: 'u1',
      orgId: 'o1'
    }))
    drizzle.membership.findFirst = jest.fn(() => ({
      id: 'm1',
      userId: 'u1',
      orgId: 'o1',
      role: 'ADMIN'
    }))
    service.generateTokens = jest.fn(async () => await Promise.resolve({ accessToken: 'jwt', refreshToken: 'rtok' }))
    await expect(service.refreshAccessToken('rtok')).resolves.toEqual({ accessToken: 'jwt', refreshToken: 'rtok' })
  })
})
