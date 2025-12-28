import { BillingService } from "../billing.service";

describe("BillingService", () => {
  it("should be defined", () => {
    expect(BillingService).toBeDefined();
  });
  it("should return stub checkout url", async () => {
    const service = new BillingService();
    const result = await service.createCheckoutSession();
    expect(result.url).toMatch(/^https:\/\/billing\.example\.com\/checkout/);
  });
});
