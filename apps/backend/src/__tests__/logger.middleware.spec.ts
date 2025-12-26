import 'reflect-metadata';
import { LoggerMiddleware } from '../logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(LoggerMiddleware).toBeDefined();
  });

  it('should call next and log on finish', () => {
    const logger = require('../logger').default;
    jest.spyOn(logger, 'info').mockImplementation(() => { });
    const middleware = new LoggerMiddleware();
    const req = { method: 'GET', originalUrl: '/test' };
    const res: any = { statusCode: 200, on: jest.fn((event, cb) => { if (event === 'finish') cb(); }) };
    const next = jest.fn();
    middleware.use(req as any, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(logger.info).toHaveBeenCalled();
  });
});
