import { LoggerMiddleware } from '../logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(LoggerMiddleware).toBeDefined();
  });

  it('should call next and log on finish', () => {
    const logger = { info: jest.fn() };
    const middleware = new LoggerMiddleware(logger);
    const req = { method: 'GET', originalUrl: '/test' };
    const res = { statusCode: 200, on: jest.fn((event, cb) => { if (event === 'finish') cb(); }) };
    const next = jest.fn();
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(logger.info).toHaveBeenCalledWith('%s %s %d %dms', 'GET', '/test', 200, expect.any(Number));
  });

  it('should use default logger if not injected', () => {
    const middleware = new LoggerMiddleware();
    const req = { method: 'POST', originalUrl: '/default' };
    const res = { statusCode: 201, on: jest.fn((event, cb) => { if (event === 'finish') cb(); }) };
    const next = jest.fn();
    // Spy on getLogger
    // Import getLogger for spying
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getLogger = require('../logger').getLogger;
    const spy = jest.spyOn({ getLogger }, 'getLogger').mockReturnValue({ info: jest.fn() });
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    spy.mockRestore();
  });
});
