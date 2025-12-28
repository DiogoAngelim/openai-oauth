import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";

process.env.GOOGLE_CLIENT_ID = "test-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
process.env.GOOGLE_CALLBACK_URL = "http://localhost/callback";

describe("AppModule", () => {
  let module: AppModule;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    module = testingModule.get(AppModule);
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
