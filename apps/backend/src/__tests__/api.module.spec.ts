import { Test, TestingModule } from '@nestjs/testing';
import { ApiModule } from '../api/api.module';

describe('ApiModule', () => {
  let module: ApiModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();
    module = testingModule.get<ApiModule>(ApiModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
