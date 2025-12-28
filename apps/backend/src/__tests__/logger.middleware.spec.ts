import { LoggerMiddleware } from '../logger.middleware'

describe('LoggerMiddleware', () => {
  it('should call next and log on finish', () => {
    const req = { method: 'POST', originalUrl: '/default' } as any
    const res = { statusCode: 201, on: jest.fn((event, cb) => cb()) } as any
    const next = jest.fn()
    const mockLogger = { info: jest.fn() }
    const middleware = new LoggerMiddleware(mockLogger as any)
    middleware.use(req, res, next)
    expect(mockLogger.info).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
