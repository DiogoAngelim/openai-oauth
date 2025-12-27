import { AdminController } from '../admin.controller';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(() => {
    controller = new AdminController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
