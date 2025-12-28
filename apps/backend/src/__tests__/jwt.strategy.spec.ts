import { JwtStrategy } from '../auth/jwt.strategy'
describe('JwtStrategy', () => {
  it('should call validateUserFromJwt with payload', async () => {
    const authService = { validateUserFromJwt: jest.fn().mockResolvedValue({ id: 'id' }) }
    const strategy = new JwtStrategy(authService as any)
    const result = await strategy.validate({ sub: 'id' })
    expect(authService.validateUserFromJwt).toHaveBeenCalledWith({ sub: 'id' })
    expect(result).toEqual({ id: 'id' })
  })
  it('should handle null result', async () => {
    const authService = { validateUserFromJwt: jest.fn().mockResolvedValue(null) }
    const strategy = new JwtStrategy(authService as any)
    const result = await strategy.validate({ sub: 'id' })
    expect(result).toBeNull()
  })
})
