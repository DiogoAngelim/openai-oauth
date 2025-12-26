import { Test } from '@nestjs/testing';
import { BillingModule } from '../billing.module';

describe('BillingModule', () => {
  let module: any;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [BillingModule],
    }).compile();
    /** @type {any} */
    module = testingModule.get(BillingModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
