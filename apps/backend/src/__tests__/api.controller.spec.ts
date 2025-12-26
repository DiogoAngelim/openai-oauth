import { ApiController } from '../api/api.controller';

describe('ApiController', () => {
  let controller: any;

  beforeEach(() => {
    controller = new ApiController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
