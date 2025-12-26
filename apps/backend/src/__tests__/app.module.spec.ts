import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('AppModule', () => {
  let module: AppModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    module = testingModule.get<AppModule>(AppModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
