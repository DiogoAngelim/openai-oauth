import { RolesGuard } from '../auth/roles.guard'
import { ForbiddenException } from '@nestjs/common'

describe('RolesGuard', () => {
  let guard: RolesGuard
  let reflector: any
  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() }
    guard = new RolesGuard(reflector)
  })
  it('should allow if no roles required', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(undefined)
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'ADMIN' } }) })
    }
    expect(guard.canActivate(context as any)).toBe(true)
  })
  it('should allow if user has required role', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(['ADMIN'])
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'ADMIN' } }) })
    }
    expect(guard.canActivate(context as any)).toBe(true)
  })
  it('should throw if user missing', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(['ADMIN'])
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({}) })
    }
    expect(() => guard.canActivate(context as any)).toThrow(ForbiddenException)
  })
  it('should throw if user has wrong role', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(['ADMIN'])
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'USER' } }) })
    }
    expect(() => guard.canActivate(context as any)).toThrow(ForbiddenException)
  })

  it('should throw if user.role is not a string', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(['ADMIN'])
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 123 } }) })
    }
    expect(() => guard.canActivate(context as any)).toThrow(ForbiddenException)
  })
})
