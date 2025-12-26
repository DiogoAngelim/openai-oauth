import 'jest';
import 'reflect-metadata';
import { RolesGuard } from '../roles.guard';
// import { Reflector } from '@nestjs/core';
import { ForbiddenException, ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: any;
  let context: any;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RolesGuard(reflector);
    context = {
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'ADMIN' } }) }),
      getHandler: jest.fn(),
      getClass: jest.fn()
    };
  });

  it('should be defined', () => {
    expect(RolesGuard).toBeDefined();
  });

  it('should allow if no roles required', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(undefined);
    expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(true);
  });

  it('should allow if user has required role', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(['ADMIN']);
    expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(true);
  });

  it('should throw if user missing or role not allowed', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(['USER']);
    context.switchToHttp = () => ({ getRequest: () => ({ user: { role: 'ADMIN' } }) });
    expect(() => guard.canActivate(context as unknown as ExecutionContext)).toThrow(ForbiddenException);
  });

  it('should throw if user is null', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(['ADMIN']);
    context.switchToHttp = () => ({ getRequest: () => ({ user: null }) });
    expect(() => guard.canActivate(context as unknown as ExecutionContext)).toThrow(ForbiddenException);
  });
});
