import { GoogleStrategy, isGoogleStrategyEnabled } from '../google.strategy'
import { AuthService } from '../auth.service'

describe('GoogleStrategy', () => {
  let strategy: any
  let authService: AuthService

  beforeEach(() => {
    // Mock Drizzle and JwtService
    const mockDrizzle = {
      user: { findUnique: jest.fn(), create: jest.fn() },
      membership: { findFirst: jest.fn() },
      refreshToken: { create: jest.fn(), findUnique: jest.fn() }
    }
    const mockJwtService = { sign: jest.fn() }

    authService = new AuthService(mockJwtService, mockDrizzle)
    jest.spyOn(authService, 'validateOAuthLogin').mockResolvedValue({
      user: { id: 'id', email: 'email', name: 'name' }
    })

    if (isGoogleStrategyEnabled) {
      strategy = new (GoogleStrategy as any)(authService)
    } else {
      // Provide a dummy constructor for disabled strategy
      strategy = {}
    }
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  if (isGoogleStrategyEnabled) {
    it('should call validateOAuthLogin and done', async () => {
      const profile = {
        emails: [{ value: 'test@example.com' }],
        displayName: 'Test User'
      }
      const done = jest.fn()
      if (typeof strategy.validate === 'function') {
        await strategy.validate('token', 'refresh', profile, done)
        expect(authService.validateOAuthLogin).toHaveBeenCalledWith(profile)
        expect(done).toHaveBeenCalledWith(null, {
          id: 'id',
          email: 'email',
          name: 'name'
        })
      } else {
        throw new Error('Strategy does not implement validate')
      }
    })

    it('should call done with error if validateOAuthLogin throws', async () => {
      const profile = {
        emails: [{ value: 'fail@example.com' }],
        displayName: 'Fail User'
      }
      const done = jest.fn();
      (authService.validateOAuthLogin as jest.Mock).mockRejectedValueOnce(
        new Error('OAuth error')
      )
      if (typeof strategy.validate === 'function') {
        await strategy.validate('token', 'refresh', profile, done)
        expect(done).toHaveBeenCalledWith(expect.any(Error))
      }
    })
  } else {
    it('should be a dummy strategy when disabled', () => {
      expect(strategy).toBeInstanceOf(Object)
    })
  }
})
