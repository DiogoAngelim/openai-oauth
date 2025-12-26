import { AdminController } from '../admin.controller';

describe('AdminController', () => {
  let controller: any;

  beforeEach(() => {
    controller = new AdminController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
