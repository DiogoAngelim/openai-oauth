import { Injectable, CanActivate, ExecutionContext, SetMetadata, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const Roles = (...roles: string[]): ReturnType<typeof SetMetadata> => SetMetadata('roles', roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor (private readonly reflector: Reflector) { }

  canActivate (context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass()
    ])
    if (requiredRoles == null || requiredRoles.length === 0) return true
    const { user } = context.switchToHttp().getRequest()
    if (user == null || typeof user.role !== 'string' || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient role')
    }
    return true
  }
}
