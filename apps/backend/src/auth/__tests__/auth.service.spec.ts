import { AuthService } from '../auth.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService
  let drizzleMock: {
    select: jest.Mock
    insert: jest.Mock
    update: jest.Mock
    delete: jest.Mock
    // Add any other methods your AuthService expects from Drizzle
    user: { findUnique: jest.Mock, create: jest.Mock }
    organization: { create: jest.Mock }
    membership: { findFirst: jest.Mock }
    refreshToken: { create: jest.Mock, findUnique: jest.Mock }
  }

  beforeEach(() => {
    jwtService = {
      sign: jest.fn().mockReturnValue('token')
    } as unknown as JwtService
    drizzleMock = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      user: { findUnique: jest.fn(), create: jest.fn() },
      organization: { create: jest.fn() },
      membership: { findFirst: jest.fn() },
      refreshToken: { create: jest.fn(), findUnique: jest.fn() }
    } as unknown as any // Use 'any' to match Drizzle client
    service = new AuthService(jwtService, drizzleMock as any)
  })

  it('should throw UnauthorizedException if user creation fails', async () => {
    drizzleMock.user.findUnique.mockResolvedValue(null)
    drizzleMock.user.create.mockResolvedValue(null)
    await expect(service.validateOAuthLogin({ emails: [{ value: 'test@example.com' }], displayName: 'Test' })).rejects.toThrow('User creation failed')
  })

  it('should throw UnauthorizedException if no membership found', async () => {
    drizzleMock.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' })
    drizzleMock.membership.findFirst.mockResolvedValue(null)
    await expect(service.validateOAuthLogin({ emails: [{ value: 'test@example.com' }], displayName: 'Test' })).rejects.toThrow('No organization membership found')
  })

  it('should create tokens and save refreshToken', async () => {
    drizzleMock.refreshToken.create.mockResolvedValue({})
    const user = {
      id: '1',
      name: null,
      email: '',
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await service.generateTokens(user, 'org1', 'ADMIN')
    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')
    expect(drizzleMock.refreshToken.create).toHaveBeenCalled()
  })

  it('should validate user from jwt', async () => {
    drizzleMock.user.findUnique.mockResolvedValue({ id: '1' })
    const user = await service.validateUserFromJwt({ sub: '1' })
    expect(user).toEqual({ id: '1' })
  })

  it('should throw UnauthorizedException for invalid refresh token', async () => {
    drizzleMock.refreshToken.findUnique.mockResolvedValue(null)
    await expect(service.refreshAccessToken('badtoken')).rejects.toThrow('Invalid refresh token')
  })

  it('should throw UnauthorizedException for expired refresh token', async () => {
    drizzleMock.refreshToken.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() - 1000), user: { id: '1' } })
    await expect(service.refreshAccessToken('expiredtoken')).rejects.toThrow('Invalid refresh token')
  })

  it('should throw UnauthorizedException for missing membership in refreshAccessToken', async () => {
    drizzleMock.refreshToken.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() + 1000 * 60 * 60), user: { id: '1' }, userId: '1' })
    drizzleMock.membership.findFirst.mockResolvedValue(null)
    await expect(service.refreshAccessToken('token')).rejects.toThrow('No organization membership found')
  })

  it('should successfully refresh access token', async () => {
    drizzleMock.refreshToken.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() + 1000 * 60 * 60), user: { id: '1' }, userId: '1' })
    drizzleMock.membership.findFirst.mockResolvedValue({ organizationId: 'org1', role: 'ADMIN', organization: {} })
    drizzleMock.refreshToken.create.mockResolvedValue({})
    const result = await service.refreshAccessToken('token')
    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')
    expect(drizzleMock.refreshToken.create).toHaveBeenCalled()
  })
})
