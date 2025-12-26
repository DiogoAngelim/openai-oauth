import 'reflect-metadata';
import { RateLimitService } from '../rate-limit/rate-limit.service';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    incr: jest.fn(),
    expire: jest.fn()
  }));
});

const Redis = require('ioredis');

describe('RateLimitService', () => {
  let service: RateLimitService;
  let redisMock: any;

  beforeEach(() => {
    redisMock = new Redis();
    redisMock.incr.mockReset();
    redisMock.expire.mockReset();
    service = new RateLimitService(redisMock);
  });

  it('should be defined', () => {
    expect(RateLimitService).toBeDefined();
  });

  it('should allow under the limit', async () => {
    redisMock.incr.mockResolvedValueOnce(1);
    redisMock.expire.mockResolvedValueOnce(1);
    await expect(service.check('user1', 5, 60)).resolves.toBeUndefined();
    expect(redisMock.incr).toHaveBeenCalled();
    expect(redisMock.expire).toHaveBeenCalled();
  });

  it('should allow at the limit', async () => {
    redisMock.incr.mockResolvedValueOnce(5);
    await expect(service.check('user1', 5, 60)).resolves.toBeUndefined();
  });

  it('should throw if over the limit', async () => {
    redisMock.incr.mockResolvedValueOnce(6);
    await expect(service.check('user1', 5, 60)).rejects.toMatchObject({ name: 'BadRequestException' });
  });
});
