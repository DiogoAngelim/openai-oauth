import { RateLimitService } from '../rate-limit/rate-limit.service'
import Redis from 'ioredis'

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    incr: jest.fn(),
    expire: jest.fn()
  }))
})

describe('RateLimitService', () => {
  let service: RateLimitService
  let redisMock: jest.Mocked<Redis>

  beforeEach(() => {
    redisMock = new (Redis as any)() as jest.Mocked<Redis>
    redisMock.incr.mockReset()
    redisMock.expire.mockReset()
    service = new RateLimitService(redisMock)
  })

  it('should be defined', () => {
    expect(RateLimitService).toBeDefined()
  })

  it('should allow under the limit', async () => {
    redisMock.incr.mockResolvedValueOnce(1 as any)
    redisMock.expire.mockResolvedValueOnce(1 as any)
    await expect(service.check('user1', 5, 60)).resolves.toBeUndefined()
    expect(redisMock.incr).toHaveBeenCalled()
    expect(redisMock.expire).toHaveBeenCalled()
  })

  it('should allow at the limit', async () => {
    redisMock.incr.mockResolvedValueOnce(5 as any)
    await expect(service.check('user1', 5, 60)).resolves.toBeUndefined()
  })

  it('should throw if over the limit', async () => {
    redisMock.incr.mockResolvedValueOnce(6 as any)
    await expect(service.check('user1', 5, 60)).rejects.toHaveProperty('name', 'BadRequestException')
  })
})