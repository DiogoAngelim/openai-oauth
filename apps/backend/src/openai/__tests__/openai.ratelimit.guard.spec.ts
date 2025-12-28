import { OpenAIRateLimitGuard } from '../openai.guard'

describe('OpenAIRateLimitGuard', () => {
  let rateLimit: { check: jest.Mock }
  let guard: OpenAIRateLimitGuard
  let context: any

  beforeEach(() => {
    rateLimit = { check: jest.fn().mockResolvedValue(true) }
    guard = new OpenAIRateLimitGuard(rateLimit as any)
    context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { sub: 'user1', orgId: 'org1' } })
      })
    }
  })

  it('should allow if rate limits pass', async () => {
    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(rateLimit.check).toHaveBeenCalledWith('user:user1', 60, 60)
    expect(rateLimit.check).toHaveBeenCalledWith('org:org1', 300, 60)
  })

  it('should throw if user rate limit fails', async () => {
    rateLimit.check.mockRejectedValueOnce(new Error('user limit'))
    await expect(guard.canActivate(context)).rejects.toThrow('user limit')
  })

  it('should throw if org rate limit fails', async () => {
    rateLimit.check.mockResolvedValueOnce(true)
    rateLimit.check.mockRejectedValueOnce(new Error('org limit'))
    await expect(guard.canActivate(context)).rejects.toThrow('org limit')
  })

  it('should handle missing user gracefully', async () => {
    context.switchToHttp = () => ({ getRequest: () => ({}) })
    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(rateLimit.check).toHaveBeenCalledWith('user:undefined', 60, 60)
    expect(rateLimit.check).toHaveBeenCalledWith('org:undefined', 300, 60)
  })
})
