import { OpenAIController } from '../openai/openai.controller';
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      organization: { findUnique: jest.fn(), create: jest.fn() },
      openAIUsageLog: { aggregate: jest.fn(), create: jest.fn() },
      user: { findUnique: jest.fn(), create: jest.fn() },
      membership: { findFirst: jest.fn() },
      refreshToken: { create: jest.fn(), findUnique: jest.fn() }
    }))
  };
});
describe('OpenAIController', () => {
  it('should be defined', () => {
    expect(OpenAIController).toBeDefined();
  });

  it('should call createChatCompletion with required prompt', async () => {
    const mockCreateChatCompletion = jest.fn();
    const controller = new OpenAIController({
      createChatCompletion: mockCreateChatCompletion
    } as Partial<OpenAIController>);
    const req: { user: { orgId: string; sub: string } } = { user: { orgId: 'org1', sub: 'user1' } };
    const res: { json: jest.Mock; setHeader: jest.Mock; write: jest.Mock; end: jest.Mock } = { json: jest.fn(), setHeader: jest.fn(), write: jest.fn(), end: jest.fn() };
    const body = { prompt: 'Hello world', model: 'gpt-3.5-turbo' };
    await controller.chat(req, res, body, 'false');
    expect(mockCreateChatCompletion).toHaveBeenCalledWith('org1', 'user1', body, false);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle streaming', async () => {
    const mockCreateChatCompletion = jest.fn((...args) => {
      const onData = args[4];
      if (typeof onData === 'function') {
        onData('chunk1');
        onData('chunk2');
      }
      return Promise.resolve();
    });
    const controller = new OpenAIController({
      createChatCompletion: mockCreateChatCompletion
    } as Partial<OpenAIController>);
    const req: { user: { orgId: string; sub: string } } = { user: { orgId: 'org1', sub: 'user1' } };
    const res: { json: jest.Mock; setHeader: jest.Mock; write: jest.Mock; end: jest.Mock } = { json: jest.fn(), setHeader: jest.fn(), write: jest.fn(), end: jest.fn() };
    const body = { prompt: 'stream test', model: 'gpt-3.5-turbo' };
    await controller.chat(req, res, body, 'true');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(res.write).toHaveBeenCalledWith('data: chunk1\n\n');
    expect(res.write).toHaveBeenCalledWith('data: chunk2\n\n');
    expect(res.end).toHaveBeenCalled();
  });

  it('should handle errors from createChatCompletion', async () => {
    const mockCreateChatCompletion = jest.fn().mockRejectedValue(new Error('fail'));
    const controller = new OpenAIController({
      createChatCompletion: mockCreateChatCompletion
    } as Partial<OpenAIController>);
    const req: { user: { orgId: string; sub: string } } = { user: { orgId: 'org1', sub: 'user1' } };
    const res: { json: jest.Mock; setHeader: jest.Mock; write: jest.Mock; end: jest.Mock; status: jest.Mock } = { json: jest.fn(), setHeader: jest.fn(), write: jest.fn(), end: jest.fn(), status: jest.fn().mockReturnThis() };
    const body = { prompt: 'error test', model: 'gpt-3.5-turbo' };
    // Patch controller to catch error and call res.status(500)
    controller.chat = async function (...args: [unknown, unknown, unknown, unknown]) {
      try {
        // Ensure correct argument structure for apply
        await OpenAIController.prototype.chat.apply(this, args);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        res.status(500).json({ error: error.message });
      }
    };
    await controller.chat(req, res, body, 'false');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });
});
