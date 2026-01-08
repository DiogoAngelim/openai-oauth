import { GoogleStrategy } from '../auth/google.strategy'
describe('GoogleStrategy', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    process.env.GOOGLE_CLIENT_ID = 'test_id'
    process.env.GOOGLE_CLIENT_SECRET = 'test_secret'
    process.env.GOOGLE_CALLBACK_URL = 'http://localhost/auth/google/callback'
  })
  afterAll(() => {
    process.env = OLD_ENV
  })

  it('should call done with user fields', async () => {
    const authService = {
      validateOAuthLogin: jest
        .fn()
        .mockResolvedValue({ user: { id: 'id', email: 'e', name: 'n' } })
    }
    const strategy = new GoogleStrategy(authService as any)
    const done = jest.fn()
    await strategy.validate('a', 'r', { emails: [], displayName: 'd' }, done)
    expect(done).toHaveBeenCalledWith(null, {
      user: {
        id: 'id',
        email: 'e',
        name: 'n'
      }
    })
  })

  it('should handle missing user fields', async () => {
    const authService = {
      validateOAuthLogin: jest.fn().mockResolvedValue({ user: {} })
    }
    const strategy = new GoogleStrategy(authService as any)
    const done = jest.fn()
    await strategy.validate('a', 'r', { emails: [], displayName: 'd' }, done)
    expect(done).toHaveBeenCalledWith(null, {
      user: {
        id: undefined,
        email: undefined,
        name: undefined
      }
    })
  })

  it('should throw if env vars missing', () => {
    delete process.env.GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_SECRET
    delete process.env.GOOGLE_CALLBACK_URL
    const authService = { validateOAuthLogin: jest.fn() }
    expect(() => new GoogleStrategy(authService as any)).toThrow(
      'OAuth2Strategy requires a clientID option'
    )
  })

  it('should call done with undefined fields if profile is missing', async () => {
    const authService = {
      validateOAuthLogin: jest.fn().mockResolvedValue({ user: {} })
    }
    const strategy = new GoogleStrategy(authService as any)
    const done = jest.fn()
    await strategy.validate('a', 'r', undefined as any, done)
    expect(done).toHaveBeenCalledWith(null, {
      user: {
        id: undefined,
        email: undefined,
        name: undefined
      }
    })
  })
  it('should throw if env vars missing', () => {
    const oldId = process.env.GOOGLE_CLIENT_ID
    const oldSecret = process.env.GOOGLE_CLIENT_SECRET
    delete process.env.GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_SECRET
    const authService = { validateOAuthLogin: jest.fn() }
    expect(() => new GoogleStrategy(authService as any)).toThrow(
      'OAuth2Strategy requires a clientID option'
    )
    process.env.GOOGLE_CLIENT_ID = oldId
    process.env.GOOGLE_CLIENT_SECRET = oldSecret
  })
})

it('should throw if env vars missing', () => {
  const oldId = process.env.GOOGLE_CLIENT_ID
  const oldSecret = process.env.GOOGLE_CLIENT_SECRET
  delete process.env.GOOGLE_CLIENT_ID
  delete process.env.GOOGLE_CLIENT_SECRET
  const authService = { validateOAuthLogin: jest.fn() }
  expect(() => new GoogleStrategy(authService as any)).toThrow(
    'OAuth2Strategy requires a clientID option'
  )
  process.env.GOOGLE_CLIENT_ID = oldId
  process.env.GOOGLE_CLIENT_SECRET = oldSecret
})
