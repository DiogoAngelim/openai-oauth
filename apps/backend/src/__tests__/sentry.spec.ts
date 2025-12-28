import * as SentryLib from "../sentry";

describe("Sentry", () => {
  it("should be a module", () => {
    expect(typeof SentryLib).toBe("object");
  });
});
