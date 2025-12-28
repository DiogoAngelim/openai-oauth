import { Test, TestingModule } from '@nestjs/testing'
import { RateLimitModule } from '../rate-limit/rate-limit.module'
import { RateLimitService } from '../rate-limit/rate-limit.service'
import Redis from 'ioredis'

describe('RateLimitModule', () => {
  it('should compile and provide RateLimitService', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RateLimitModule]
    })
      .overrideProvider('REDIS')
      .useValue({})
      .compile()
    const service = module.get<RateLimitService>(RateLimitService)
    expect(service).toBeDefined()
  })

  it('should use REDIS_URL from env', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379'
    const module: TestingModule = await Test.createTestingModule({
      imports: [RateLimitModule]
    })
      .overrideProvider('REDIS')
      .useFactory({
        factory: () => new Redis((typeof process.env.REDIS_URL === 'string' ? process.env.REDIS_URL : ''))
      })
      .compile()
    const redis = module.get<Redis>('REDIS')
    expect(redis).toBeInstanceOf(Redis)
  })

  it('should use empty string if REDIS_URL is not set', async () => {
    delete process.env.REDIS_URL
    const module: TestingModule = await Test.createTestingModule({
      imports: [RateLimitModule]
    })
      .overrideProvider('REDIS')
      .useFactory({
        factory: () => new Redis('')
      })
      .compile()
    const redis = module.get<Redis>('REDIS')
    expect(redis).toBeInstanceOf(Redis)
  })
})
