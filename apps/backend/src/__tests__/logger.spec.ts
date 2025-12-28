import { getLogger } from "../logger";

describe("logger", () => {
  it("should be defined", () => {
    expect(getLogger()).toBeDefined();
  });
  it("should have info method", () => {
    expect(typeof getLogger().info).toBe("function");
  });
  it("should have error method", () => {
    expect(typeof getLogger().error).toBe("function");
  });
  it("should use debug level in non-production", () => {
    const prev = process.env.NODE_ENV;
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      configurable: true,
    });
    const testLogger = getLogger();
    expect(testLogger.level).toBe("debug");
    Object.defineProperty(process.env, "NODE_ENV", {
      value: prev,
      configurable: true,
    });
  });
  it("should use info level in production", () => {
    const prev = process.env.NODE_ENV;
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      configurable: true,
    });
    const testLogger = getLogger();
    expect(testLogger.level).toBe("info");
    Object.defineProperty(process.env, "NODE_ENV", {
      value: prev,
      configurable: true,
    });
  });
});
