import { ApiController } from '../api.controller';

describe('ApiController', () => {
  let controller: ApiController;

  beforeEach(() => {
    controller = new ApiController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user info from me()', async () => {
    const req = { user: { orgId: 'org1', role: 'ADMIN', name: 'Test' } };
    const result = await controller.me(req);
    expect(result).toEqual({ user: req.user, orgId: 'org1', role: 'ADMIN' });
  });

  it('should return admin/owner access from adminOnly()', async () => {
    const req = { user: { orgId: 'org1', role: 'OWNER', name: 'Test' } };
    const result = await controller.adminOnly(req);
    expect(result).toEqual({ message: 'Admin/Owner access granted', user: req.user });
  });
});
