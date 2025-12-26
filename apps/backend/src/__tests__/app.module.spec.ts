import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('AppModule', () => {
  let module: any;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    /** @type {any} */
    module = testingModule.get(AppModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
