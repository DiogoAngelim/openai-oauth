import { Test, TestingModule } from '@nestjs/testing';
import { BillingModule } from '../billing.module';

describe('BillingModule', () => {
  let module: BillingModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [BillingModule],
    }).compile();
    module = testingModule.get<BillingModule>(BillingModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
