import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { RateLimitService } from '../rate-limit/rate-limit.service'

@Injectable()
export class OpenAIRateLimitGuard implements CanActivate {
  constructor (private readonly rateLimit: RateLimitService) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId = req.user?.sub
    const orgId = req.user?.orgId
    // Per-user: 60 req/min, per-org: 300 req/min
    await this.rateLimit.check(`user:${String(userId)}`, 60, 60)
    await this.rateLimit.check(`org:${String(orgId)}`, 300, 60)
    return true
  }
}
