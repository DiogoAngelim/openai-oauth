import { Test } from "@nestjs/testing";
import { ApiModule } from "../api/api.module";

describe("ApiModule", () => {
  let module: ApiModule;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();
    module = testingModule.get(ApiModule, { strict: false });
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
