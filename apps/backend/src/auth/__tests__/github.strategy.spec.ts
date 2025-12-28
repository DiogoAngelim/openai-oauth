import { GithubStrategy } from '../github.strategy'
import { AuthService } from '../auth.service'

describe('GithubStrategy', () => {
  let strategy: GithubStrategy
  let authService: AuthService

  beforeEach(() => {
    // Remove PrismaClient reference and mock Dizzle instead
    const mockDizzle = {} as any // Replace with actual Dizzle mock if available
    authService = Object.assign(
      new AuthService(
        { sign: jest.fn() } as unknown as import('@nestjs/jwt').JwtService,
        mockDizzle // Use Dizzle here
      ),
      {
        validateOAuthLogin: jest.fn().mockResolvedValue({
          user: { id: 'id', email: 'email', name: 'name' }
        })
      }
    )
    strategy = new GithubStrategy(authService)
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

process.env.GITHUB_CLIENT_ID = 'test-id'
process.env.GITHUB_CLIENT_SECRET = 'test-secret'
process.env.BACKEND_URL = 'http://localhost:4000'
