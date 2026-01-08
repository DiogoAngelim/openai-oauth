// This file is a stub to prevent test runner confusion. The real tests are in ../auth/__tests__/auth.service.spec.ts.

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

  describe('Stub', () => {
    it('should be ignored', () => {
      expect(true).toBe(true)
    })
  })

  it('should throw if membership is undefined', async () => {
    drizzle.user.findUnique = jest.fn(() => ({ id: 'u1' }))
    drizzle.membership.findFirst = jest.fn(() => undefined)
    const profile = {
      emails: [{ value: 'u1@example.com' }],
      displayName: 'User'
    }
    await expect(service.validateOAuthLogin(profile)).rejects.toThrow(
      'No organization membership found'
    )
  })

  it('should return user if valid', async () => {
    drizzle.user.findUnique = jest.fn(() => ({ id: 'u1' }))
    drizzle.membership.findFirst = jest.fn(() => ({ id: 'm1' }))
    const profile = {
      emails: [{ value: 'u1@example.com' }],
      displayName: 'User'
    }
    await expect(service.validateOAuthLogin(profile)).resolves.toEqual({
      user: { id: 'u1' }
    })
  })

  it('should throw if refreshToken is invalid', async () => {
    drizzle.refreshToken.findUnique = jest.fn(() => undefined)
    await expect(service.refreshAccessToken('bad')).rejects.toThrow(
      'Invalid refresh token'
    )
  })

  it('should throw if refreshToken is expired', async () => {
    drizzle.refreshToken.findUnique = jest.fn(() => ({
      token: 'rtok',
      expiresAt: new Date(Date.now() - 10000)
    }))
    await expect(service.refreshAccessToken('rtok')).rejects.toThrow(
      'Invalid refresh token'
    )
  })

  it('should throw if membership is missing in refreshAccessToken', async () => {
    drizzle.membership.findFirst = jest.fn(() => undefined)
    drizzle.refreshToken.findUnique = jest.fn(() => ({
      token: 'rtok',
      expiresAt: new Date(Date.now() + 10000)
    }))
    await expect(service.refreshAccessToken('rtok')).rejects.toThrow(
      'No organization membership found'
    )
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
    service.generateTokens = jest.fn(
      async () =>
        await Promise.resolve({ accessToken: 'jwt', refreshToken: 'rtok' })
    )
    await expect(service.refreshAccessToken('rtok')).resolves.toEqual({
      accessToken: 'jwt',
      refreshToken: 'rtok'
    })
  })

  it('should throw if drizzle.refreshToken.create fails in generateTokens', async () => {
    drizzle.refreshToken.create = jest.fn(() => { throw new Error('fail') })
    await expect(
      service.generateTokens({ id: 'u1' }, 'org1', 'ADMIN')
    ).rejects.toThrow('fail')
  })

  it('should call drizzle.user.findUnique in validateUserFromJwt', async () => {
    drizzle.user.findUnique = jest.fn(() => ({ id: 'u1' }))
    const payload = { sub: 'u1' }
    await expect(service.validateUserFromJwt(payload)).resolves.toEqual({ id: 'u1' })
    expect(drizzle.user.findUnique).toHaveBeenCalledWith({ where: { id: 'u1' } })
  })
})
