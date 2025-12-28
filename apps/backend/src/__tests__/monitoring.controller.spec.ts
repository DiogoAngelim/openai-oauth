import { MonitoringController } from "../monitoring.controller";

describe("MonitoringController", () => {
  it("should be defined", () => {
    expect(MonitoringController).toBeDefined();
  });

  it("should set header and send metrics", async () => {
    const res = { header: jest.fn(), send: jest.fn() };
    const controller = new MonitoringController();
    await controller.metrics(res as any);
    expect(res.header).toHaveBeenCalledWith("Content-Type", expect.any(String));
    expect(res.send).toHaveBeenCalled();
  });

  it("should do nothing if no header/send/end functions", async () => {
    const res = {};
    const controller = new MonitoringController();
    await expect(controller.metrics(res as any)).resolves.toBeUndefined();
  });

  it("should call only send if no header/setHeader", async () => {
    const res = { send: jest.fn() };
    const controller = new MonitoringController();
    await controller.metrics(res as any);
    expect(res.send).toHaveBeenCalled();
  });
});
