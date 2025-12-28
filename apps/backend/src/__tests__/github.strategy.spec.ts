import { GithubStrategy } from '../auth/github.strategy'

describe('GithubStrategy', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    process.env.GITHUB_CLIENT_ID = 'test_id'
    process.env.GITHUB_CLIENT_SECRET = 'test_secret'
    process.env.BACKEND_URL = 'http://localhost'
  })
  afterAll(() => {
    process.env = OLD_ENV
  })

  it('should call done with user fields', async () => {
    const authService = {
      validateOAuthLogin: jest.fn().mockResolvedValue({ user: { id: 'id', email: 'e', name: 'n' } })
    }
    const strategy = new GithubStrategy(authService as any)
    const done = jest.fn()
    await strategy.validate('a', 'r', { emails: [], displayName: 'd' }, done)
    expect(done).toHaveBeenCalledWith(null, { id: 'id', email: 'e', name: 'n' })
  })

  it('should handle missing user fields', async () => {
    const authService = {
      validateOAuthLogin: jest.fn().mockResolvedValue({ user: {} })
    }
    const strategy = new GithubStrategy(authService as any)
    const done = jest.fn()
    await strategy.validate('a', 'r', { emails: [], displayName: 'd' }, done)
    expect(done).toHaveBeenCalledWith(null, { id: undefined, email: undefined, name: undefined })
  })

  it('should throw if env vars missing', () => {
    delete process.env.GITHUB_CLIENT_ID
    delete process.env.GITHUB_CLIENT_SECRET
    delete process.env.BACKEND_URL
    const authService = { validateOAuthLogin: jest.fn() }
    expect(() => new GithubStrategy(authService as any)).toThrow('OAuth2Strategy requires a clientID option')
  })

  it('should call done with undefined fields if profile is missing', async () => {
    const authService = { validateOAuthLogin: jest.fn().mockResolvedValue({ user: {} }) }
    const strategy = new GithubStrategy(authService as any)
    const done = jest.fn()
    await strategy.validate('a', 'r', undefined as any, done)
    expect(done).toHaveBeenCalledWith(null, { id: undefined, email: undefined, name: undefined })
  })
})
