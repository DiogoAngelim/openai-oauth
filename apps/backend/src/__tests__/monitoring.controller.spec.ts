import 'reflect-metadata';
import { MonitoringController } from '../monitoring.controller';

describe('MonitoringController', () => {
  it('should be defined', () => {
    expect(MonitoringController).toBeDefined();
  });
  it('should set header and end metrics', async () => {
    const res = { setHeader: jest.fn(), end: jest.fn() };
    const controller = new MonitoringController();
    await controller.metrics(res as any);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', expect.any(String));
    expect(res.end).toHaveBeenCalled();
  });
});
