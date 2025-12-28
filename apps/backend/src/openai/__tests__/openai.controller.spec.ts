import { OpenAIController } from '../openai.controller'
import { OpenAIService } from '../openai.service'

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
    } as unknown as import('express').Request & {
      user: { orgId: string, sub: string }
    }
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn()
    } as unknown as import('express').Response
    const body = { prompt: 'Hello' }
    await controller.chat(req, res, body, 'false')
    // Removed unused mockCreateChatCompletion
    const req2 = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsLanguages: jest.fn()
      // Add more as needed for compatibility
    } as unknown as import('express').Request & { user: { orgId: string, sub: string } }
    const res2 = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      jsonp: jest.fn(),
      sendFile: jest.fn(),
      download: jest.fn()
      // Add more as needed for compatibility
    } as unknown as import('express').Response
    const body2 = { prompt: 'Hello' }
    openai.createChatCompletion.mockImplementation(
      async (_orgId, _userId, _body, _stream, cb) => {
        cb('chunk1')
        cb('chunk2')
      }
    )
    await controller.chat(req2, res2, body2, 'true')
    expect(res2.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/event-stream'
    )
    expect(res2.write).toHaveBeenCalledWith('data: chunk1\n\n')
    expect(res2.write).toHaveBeenCalledWith('data: chunk2\n\n')
    expect(res2.end).toHaveBeenCalled()
  })

  it('should handle error in chat with stream=false', async () => {
    const req = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn()
    } as unknown as import('express').Request & {
      user: { orgId: string, sub: string }
    }
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as unknown as import('express').Response
    openai.createChatCompletion.mockRejectedValue(new Error('fail'))
    await expect(controller.chat(req, res, { prompt: 'Hello' }, 'false')).rejects.toThrow('fail')
  });

  it('should handle error in chat with stream=true', async () => {
    const req = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn()
    } as unknown as import('express').Request & {
      user: { orgId: string, sub: string }
    }
    const res = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    } as unknown as import('express').Response
    openai.createChatCompletion.mockImplementation(async () => { throw new Error('fail') })
    await expect(controller.chat(req, res, { prompt: 'Hello' }, 'true')).rejects.toThrow('fail')
  });

  it('should get chat history', async () => {
    const req = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn()
    } as unknown as import('express').Request & {
      user: { orgId: string, sub: string }
    }
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn()
    } as unknown as import('express').Response
    await controller.getHistory(req, res)
    expect(openai.getUserChatHistory).toHaveBeenCalledWith('org1', 'user1')
    expect(res.json).toHaveBeenCalledWith(['history'])
  })

  it('should handle error in getHistory', async () => {
    const req = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn()
    } as unknown as import('express').Request & {
      user: { orgId: string, sub: string }
    }
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      send: jest.fn()
    } as unknown as import('express').Response
    openai.getUserChatHistory.mockRejectedValue(new Error('fail'))
    await expect(controller.getHistory(req, res)).rejects.toThrow('fail')
  });

  it('should instantiate OpenAIController', () => {
    const mockService = {} as any;
    const controller = new OpenAIController(mockService);
    expect(controller).toBeInstanceOf(OpenAIController);
  });
})
