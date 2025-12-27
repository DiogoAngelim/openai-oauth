import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('AppModule', () => {
  let module: AppModule;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    module = testingModule.get(AppModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
