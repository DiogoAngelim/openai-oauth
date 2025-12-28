import { Injectable, BadRequestException, Inject } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RateLimitService {
  constructor (@Inject('REDIS') private readonly redis: Redis) { }
  // Per-user and per-org rate limiting
  async check (key: string, limit: number, windowSec: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000)
    const windowKey = `rl:${key}:${Math.floor(now / windowSec)}`
    const count = await this.redis.incr(windowKey)
    if (count === 1) {
      await this.redis.expire(windowKey, windowSec)
    }
    if (count > limit) {
      throw new BadRequestException('Rate limit exceeded')
    }
  }
}
