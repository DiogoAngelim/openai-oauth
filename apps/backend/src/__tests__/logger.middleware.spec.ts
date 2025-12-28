import { LoggerMiddleware } from '../logger.middleware'

describe('LoggerMiddleware', () => {
  it('should call next and log on finish', () => {
    const req = { method: 'POST', originalUrl: '/default' } as any
    // Simulate real event emitter for 'finish'
    let finishCb: (() => void) | undefined
    const res = {
      statusCode: 201,
      on: jest.fn((event, cb) => {
        if (event === 'finish') finishCb = cb
      })
    } as any
    const next = jest.fn()
    const mockLogger = { info: jest.fn() }
    const middleware = new LoggerMiddleware(mockLogger as any)
    middleware.use(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(mockLogger.info).not.toHaveBeenCalled()
    // Now trigger the finish event
    finishCb?.()
    expect(mockLogger.info).toHaveBeenCalledWith(
      '%s %s %d %dms',
      'POST',
      '/default',
      201,
      expect.any(Number)
    )
  })
  it('should instantiate with default logger', () => {
    const req = { method: 'GET', originalUrl: '/default' } as any
    const res = { statusCode: 200, on: jest.fn() } as any
    const next = jest.fn()
    // Do not pass a logger, use default
    const middleware = new LoggerMiddleware()
    middleware.use(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
