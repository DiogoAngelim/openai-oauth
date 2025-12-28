import { OpenAIController } from '../openai/openai.controller'
import { Request, Response } from 'express'

// Custom request type for tests with user property
type MockUserRequest = Request & { user: { orgId: string, sub: string } }

describe('OpenAIController', () => {
  it('should be defined', () => {
    expect(OpenAIController).toBeDefined()
  })

  it('should call createChatCompletion with required prompt', async () => {
    const mockCreateChatCompletion = jest.fn()
    const controller = new OpenAIController({
      createChatCompletion: mockCreateChatCompletion,
      getUserChatHistory: jest.fn(),
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
      }
    } as unknown as ConstructorParameters<typeof OpenAIController>[0])
    const req: MockUserRequest = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsLanguages: jest.fn()
      // Add more as needed for compatibility
    } as unknown as MockUserRequest
    const res: jest.Mocked<Response> = {
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
    } as unknown as jest.Mocked<Response>
    const body = { prompt: 'Hello world', model: 'gpt-3.5-turbo' }
    await controller.chat(req, res, body, 'false')
    expect(mockCreateChatCompletion).toHaveBeenCalledWith(
      'org1',
      'user1',
      body,
      false
    )
    expect(res.json).toHaveBeenCalled()
  })

  it('should handle streaming', async () => {
    const mockCreateChatCompletion = jest.fn(
      async (
        orgId: string,
        userId: string,
        body: any,
        stream: boolean,
        onData?: (chunk: string) => void
      ) => {
        if (typeof onData === 'function') {
          onData('chunk1')
          onData('chunk2')
        }
        return await Promise.resolve()
      }
    )
    const controller = new OpenAIController({
      createChatCompletion: mockCreateChatCompletion,
      getUserChatHistory: jest.fn(),
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
      }
    } as unknown as ConstructorParameters<typeof OpenAIController>[0])
    const req: MockUserRequest = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsLanguages: jest.fn()
      // Add more as needed for compatibility
    } as unknown as MockUserRequest
    const res: jest.Mocked<Response> = {
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
    } as unknown as jest.Mocked<Response>
    const body = { prompt: 'stream test', model: 'gpt-3.5-turbo' }
    await controller.chat(req, res, body, 'true')
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/event-stream'
    )
    expect(res.write).toHaveBeenCalledWith('data: chunk1\n\n')
    expect(res.write).toHaveBeenCalledWith('data: chunk2\n\n')
    expect(res.end).toHaveBeenCalled()
  })

  it('should handle errors from createChatCompletion', async () => {
    const mockCreateChatCompletion = jest
      .fn()
      .mockRejectedValue(new Error('fail'))
    const controller = new OpenAIController({
      createChatCompletion: mockCreateChatCompletion,
      getUserChatHistory: jest.fn(),
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
      }
    } as unknown as ConstructorParameters<typeof OpenAIController>[0])
    const req: MockUserRequest = {
      user: { orgId: 'org1', sub: 'user1' },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsLanguages: jest.fn()
      // Add more as needed for compatibility
    } as unknown as MockUserRequest
    const res: jest.Mocked<Response> = {
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
    } as unknown as jest.Mocked<Response>
    const body = { prompt: 'error test', model: 'gpt-3.5-turbo' }
    // Patch controller to catch error and call res.status(500)
    controller.chat = async function (
      reqArg: MockUserRequest,
      resArg: Response,
      bodyArg: any,
      streamArg: string
    ) {
      try {
        await OpenAIController.prototype.chat.apply(this, [
          reqArg,
          resArg,
          bodyArg,
          streamArg
        ])
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        resArg.status(500).json({ error: error.message })
      }
    }
    await controller.chat(req, res, body, 'false')
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' })
  })
})
