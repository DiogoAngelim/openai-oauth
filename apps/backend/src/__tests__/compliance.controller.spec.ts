import { ComplianceController } from '../compliance.controller';

describe('ComplianceController', () => {
  it('should be defined', () => {
    expect(ComplianceController).toBeDefined();
  });
  it('should return stub status for deleteAccount', async () => {
    const controller = new ComplianceController();
    const result = await controller.deleteAccount();
    expect(result).toEqual({ status: expect.stringContaining('deleted') });
  });
});
