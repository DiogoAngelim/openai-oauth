import { LinkedinStrategy } from '../linkedin.strategy'
import { AuthService } from '../auth.service'

describe('LinkedinStrategy', () => {
  let strategy: LinkedinStrategy
  let authService: AuthService

  beforeEach(() => {
    authService = Object.assign(new AuthService({ sign: jest.fn() } as unknown as import('@nestjs/jwt').JwtService, {} as unknown as import('@prisma/client').PrismaClient), {
      validateOAuthLogin: jest.fn().mockResolvedValue({ user: { id: 'id', email: 'email', name: 'name' } })
    })
    strategy = new LinkedinStrategy(authService)
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  it('should call validateOAuthLogin and done', async () => {
    const profile = { emails: [{ value: 'test@example.com' }], displayName: 'Test User' }
    const done = jest.fn()
    await strategy.validate('token', 'refresh', profile, done)
    expect(authService.validateOAuthLogin).toHaveBeenCalledWith(profile)
    expect(done).toHaveBeenCalledWith(null, { id: 'id', email: 'email', name: 'name' })
  })
})

process.env.LINKEDIN_CLIENT_ID = 'test-id'
process.env.LINKEDIN_CLIENT_SECRET = 'test-secret'
process.env.BACKEND_URL = 'http://localhost:4000'
