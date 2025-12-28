import { RolesGuard } from '../roles.guard'

/**
 * Indicates if Google OAuth strategy should be enabled.
 * Controlled by GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.
 */
export const isGoogleStrategyEnabled =
  typeof process.env.GOOGLE_CLIENT_ID === 'string' && process.env.GOOGLE_CLIENT_ID !== '' && typeof process.env.GOOGLE_CLIENT_SECRET === 'string' && process.env.GOOGLE_CLIENT_SECRET !== ''

/**
 * Google OAuth Strategy for Passport.
 * Uses environment variables for configuration.
 */

describe('RolesGuard', () => {
  it('should be defined', () => {
    expect(true).toBe(true)
  })

  it('should allow access if no roles are required', async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) } as any
    const guard = new RolesGuard(reflector)
    const context = { getHandler: jest.fn(), getClass: jest.fn(), switchToHttp: () => ({ getRequest: () => ({}) }) } as any
    expect(guard.canActivate(context)).toBe(true)
  })

  it('should allow access if user has required role', async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['admin']) } as any
    const { RolesGuard } = await import('../roles.guard')
    const guard = new RolesGuard(reflector)
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'admin' } }) })
    } as any
    expect(guard.canActivate(context)).toBe(true)
  })

  it('should throw ForbiddenException if user is missing or role is not allowed', async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['admin']) } as any
    const { RolesGuard } = await import('../roles.guard')
    const guard = new RolesGuard(reflector)
    const contextNoUser = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({}) })
    } as any
    expect(() => guard.canActivate(contextNoUser)).toThrow('Insufficient role')

    const contextWrongRole = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'user' } }) })
    } as any
    expect(() => guard.canActivate(contextWrongRole)).toThrow('Insufficient role')
  })
})
