import { OpenAIRateLimitGuard } from '../openai.guard'
import { ExecutionContext } from '@nestjs/common'
import { OpenAIController } from '../openai.controller'
import { OpenAIService } from '../openai.service'

describe('OpenAIRateLimitGuard', () => {
  let guard: OpenAIRateLimitGuard
  let rateLimit: { check: jest.Mock }
  let context: ExecutionContext

  beforeEach(() => {
    rateLimit = { check: jest.fn().mockResolvedValue(true) }
    guard = new OpenAIRateLimitGuard(rateLimit as any)
    context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { sub: 'user1', orgId: 'org1' } })
      })
    } as any
  })

  it('should call rateLimit.check for user and org and return true', async () => {
    const result = await guard.canActivate(context)
    expect(rateLimit.check).toHaveBeenCalledWith('user:user1', 60, 60)
    expect(rateLimit.check).toHaveBeenCalledWith('org:org1', 300, 60)
    expect(result).toBe(true)
  })

  it('should handle missing user gracefully', async () => {
    context = {
      switchToHttp: () => ({
        getRequest: () => ({})
      })
    } as any
    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(rateLimit.check).toHaveBeenCalledWith('user:undefined', 60, 60)
    expect(rateLimit.check).toHaveBeenCalledWith('org:undefined', 300, 60)
  })

  it('should propagate errors from rateLimit.check', async () => {
    rateLimit.check.mockRejectedValueOnce(new Error('fail'))
    await expect(guard.canActivate(context)).rejects.toThrow('fail')
  })
})

describe('OpenAIController', () => {
  let controller: OpenAIController
  let openai: {
    createChatCompletion: jest.Mock
    getUserChatHistory: jest.Mock
  }

  beforeEach(() => {
    openai = {
      createChatCompletion: jest.fn().mockResolvedValue('result'),
      getUserChatHistory: jest.fn().mockResolvedValue(['history'])
    }
    controller = new OpenAIController(openai as unknown as OpenAIService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should handle chat with stream=false', async () => {
    const req = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn()
    } as any
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn()
    } as any
    const body = { prompt: 'Hello' }
    await controller.chat(req, res, body, 'false')
    expect(openai.createChatCompletion).toHaveBeenCalledWith(
      'org1',
      'user1',
      body,
      false
    )
    expect(res.json).toHaveBeenCalledWith('result')
  })

  it('should handle chat with stream=true', async () => {
    const req = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn()
    } as any
    const res = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn()
    } as any
    const body = { prompt: 'Hello' }
    openai.createChatCompletion.mockImplementation(
      async (_orgId, _userId, _body, _stream, cb) => {
        cb(null, 'chunk1')
        cb(null, 'chunk2')
      }
    )
    await controller.chat(req, res, body, 'true')
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/event-stream'
    )
    expect(res.write).toHaveBeenCalledWith('data: chunk1\n\n')
    expect(res.write).toHaveBeenCalledWith('data: chunk2\n\n')
    expect(res.end).toHaveBeenCalled()
  })

  it('should get chat history', async () => {
    const req = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn()
    } as any
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn()
    } as any
    await controller.getHistory(req, res)
    expect(openai.getUserChatHistory).toHaveBeenCalledWith('org1', 'user1')
    expect(res.json).toHaveBeenCalledWith(['history'])
  })
})
