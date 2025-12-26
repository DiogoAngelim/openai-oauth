
import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from '../billing.controller';
import { BillingService } from '../billing.service';

describe('BillingController', () => {
  let controller: BillingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [BillingService],
    }).compile();
    controller = module.get<BillingController>(BillingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call billing.createCheckoutSession on checkout', async () => {
    const billing = {
      createCheckoutSession: jest.fn().mockResolvedValue('session')
    };
    const controller = new BillingController(billing as any);
    const result = await controller.checkout();
    expect(billing.createCheckoutSession).toHaveBeenCalled();
    expect(result).toBe('session');
  });

  it('should handle error from billing.createCheckoutSession', async () => {
    const billing = {
      createCheckoutSession: jest.fn().mockRejectedValue(new Error('fail'))
    };
    const controller = new BillingController(billing as any);
    await expect(controller.checkout()).rejects.toThrow('fail');
  });
});
