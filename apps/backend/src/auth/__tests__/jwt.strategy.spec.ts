import 'jest'
import { JwtStrategy } from '../jwt.strategy'
import { AuthService } from '../auth.service'

// Mock Drizzle client
const mockDrizzle = {
  // Add any methods your AuthService expects from Drizzle
}

describe('JwtStrategy', () => {
  it('should be defined', () => {
    expect(JwtStrategy).toBeDefined()
  })

  it('should use JWT_SECRET if set', () => {
    process.env.JWT_SECRET = 'testsecret'
    const authService = Object.assign(
      new AuthService(
        { sign: jest.fn() } as unknown as import('@nestjs/jwt').JwtService,
        mockDrizzle
      ),
      { validateUserFromJwt: jest.fn() }
    )
    const strategy = new JwtStrategy(authService)
    expect(strategy).toBeDefined()
    expect(strategy.secretOrKey).toBe('testsecret')
  })

  it('should fallback to random secret if JWT_SECRET not set', () => {
    delete process.env.JWT_SECRET
    const jwtService = {
      sign: jest.fn()
    } as unknown as import('@nestjs/jwt').JwtService
    const authService = Object.assign(
      new AuthService(jwtService, mockDrizzle),
      { validateUserFromJwt: jest.fn() }
    )
    const strategy = new JwtStrategy(authService)
    expect(strategy).toBeDefined()
    expect(typeof strategy.secretOrKey).toBe('string')
    expect(strategy.secretOrKey.length).toBeGreaterThan(0)
  })

  it('should call validateUserFromJwt in validate()', async () => {
    process.env.JWT_SECRET = 'testsecret'
    const validateUserFromJwt = jest
      .fn()
      .mockResolvedValue({ id: '123', email: 'a@b.com' })
    const authService = Object.assign(
      new AuthService(
        { sign: jest.fn() } as unknown as import('@nestjs/jwt').JwtService,
        mockDrizzle
      ),
      { validateUserFromJwt }
    )
    const strategy = new JwtStrategy(authService)
    const payload = { sub: '123' }
    const result = await strategy.validate(payload)
    expect(validateUserFromJwt).toHaveBeenCalledWith(payload)
    expect(result).toEqual({ id: '123', email: 'a@b.com' })
  })
})
