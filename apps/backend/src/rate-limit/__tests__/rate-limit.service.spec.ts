import { RateLimitService } from '../rate-limit.service'
import { BadRequestException } from '@nestjs/common'

describe('RateLimitService', () => {
  let redisMock: any
  let service: RateLimitService

  beforeEach(() => {
    redisMock = {
      incr: jest.fn(),
      expire: jest.fn()
    }
    service = new RateLimitService(redisMock)
  })

  it('should expire key on first increment', async () => {
    redisMock.incr.mockResolvedValueOnce(1)
    await service.check('user:1', 10, 60)
    expect(redisMock.expire).toHaveBeenCalled()
  })

  it('should not expire key if not first increment', async () => {
    redisMock.incr.mockResolvedValueOnce(2)
    await service.check('user:1', 10, 60)
    expect(redisMock.expire).not.toHaveBeenCalled()
  })

  it('should throw BadRequestException if over limit', async () => {
    redisMock.incr.mockResolvedValueOnce(11)
    await expect(service.check('user:1', 10, 60)).rejects.toThrow(BadRequestException)
  })

  it('should not throw if under limit', async () => {
    redisMock.incr.mockResolvedValueOnce(5)
    await expect(service.check('user:1', 10, 60)).resolves.toBeUndefined()
  })
})
