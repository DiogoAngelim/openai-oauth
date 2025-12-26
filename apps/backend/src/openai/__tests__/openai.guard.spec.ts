import { OpenAIRateLimitGuard } from '../openai.guard';
import { RateLimitService } from '../../rate-limit/rate-limit.service';
import { ExecutionContext } from '@nestjs/common';

describe('OpenAIRateLimitGuard', () => {
  let guard: OpenAIRateLimitGuard;
  let rateLimit: RateLimitService;

  beforeEach(() => {
    rateLimit = { check: jest.fn().mockResolvedValue(true) } as any;
    guard = new OpenAIRateLimitGuard(rateLimit);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call rateLimit.check for user and org and return true', async () => {
    const req = { user: { sub: 'user1', orgId: 'org1' } };
    const context = {
      switchToHttp: () => ({ getRequest: () => req })
    } as unknown as ExecutionContext;
    const result = await guard.canActivate(context);
    expect(rateLimit.check).toHaveBeenCalledWith('user:user1', 60, 60);
    expect(rateLimit.check).toHaveBeenCalledWith('org:org1', 300, 60);
    expect(result).toBe(true);
  });

  it('should handle missing user gracefully', async () => {
    const req = { user: undefined };
    const context = {
      switchToHttp: () => ({ getRequest: () => req })
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
