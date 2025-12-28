import { Test } from "@nestjs/testing";
import { BillingModule } from "../billing.module";

describe("BillingModule", () => {
  let module: BillingModule;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [BillingModule],
    }).compile();
    module = testingModule.get(BillingModule);
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
