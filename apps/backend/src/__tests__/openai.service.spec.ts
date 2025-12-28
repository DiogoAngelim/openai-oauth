/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleStrategy, isGoogleStrategyEnabled } from '../auth/google.strategy'
import { AuthService } from '../auth/auth.service'

describe('GoogleStrategy', () => {
  let strategy: any
  let authService: AuthService

  beforeEach(() => {
    // Mock Dizzle and JwtService
    const mockDizzle = {} as any
    const mockJwtService = { sign: jest.fn() } as any

    authService = new AuthService(mockJwtService, mockDizzle)
    // Mock validateOAuthLogin
    jest.spyOn(authService, 'validateOAuthLogin').mockResolvedValue({
      user: { id: 'id', email: 'email', name: 'name' }
    })

    if (isGoogleStrategyEnabled) {
      strategy = new (GoogleStrategy as any)(authService)
    } else {
      strategy = new (GoogleStrategy as any)()
    }
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  if (isGoogleStrategyEnabled) {
    it('should call validateOAuthLogin and done', async () => {
      const profile = { emails: [{ value: 'test@example.com' }], displayName: 'Test User' }
      const done = jest.fn()
      if (typeof strategy.validate === 'function') {
        await strategy.validate('token', 'refresh', profile, done)
        expect(authService.validateOAuthLogin).toHaveBeenCalledWith(profile)
        expect(done).toHaveBeenCalledWith(null, { id: 'id', email: 'email', name: 'name' })
      } else {
        throw new Error('Strategy does not implement validate')
      }
    })
  } else {
    it('should be a dummy strategy when disabled', () => {
      expect(strategy).toBeInstanceOf(Object)
    })
  }
})