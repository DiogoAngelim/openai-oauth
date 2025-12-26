import { OpenAIController } from '../openai.controller';
import { OpenAIService } from '../openai.service';

describe('OpenAIController', () => {
  let controller: OpenAIController;
  let openai: OpenAIService;

  beforeEach(() => {
    openai = {
      createChatCompletion: jest.fn().mockResolvedValue('result'),
      getUserChatHistory: jest.fn().mockResolvedValue(['history'])
    } as any;
    controller = new OpenAIController(openai);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle chat with stream=false', async () => {
    const req = { user: { orgId: 'org1', sub: 'user1' } };
    const res = { json: jest.fn() };
    const body = { prompt: 'Hello' };
    await controller.chat(req as any, res as any, body, 'false');
    expect(openai.createChatCompletion).toHaveBeenCalledWith('org1', 'user1', body, false);
    expect(res.json).toHaveBeenCalledWith('result');
  });

  it('should handle chat with stream=true', async () => {
    const req = { user: { orgId: 'org1', sub: 'user1' } };
    const res = { setHeader: jest.fn(), write: jest.fn(), end: jest.fn() };
    const body = { prompt: 'Hello' };
    (openai.createChatCompletion as jest.Mock).mockImplementation(async (_orgId, _userId, _body, _stream, cb) => {
      cb('chunk1');
      cb('chunk2');
    });
    await controller.chat(req as any, res as any, body, 'true');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(res.write).toHaveBeenCalledWith('data: chunk1\n\n');
    expect(res.write).toHaveBeenCalledWith('data: chunk2\n\n');
    expect(res.end).toHaveBeenCalled();
  });

  it('should get chat history', async () => {
    const req = { user: { orgId: 'org1', sub: 'user1' } };
    const res = { json: jest.fn() };
    await controller.getHistory(req as any, res as any);
    expect(openai.getUserChatHistory).toHaveBeenCalledWith('org1', 'user1');
    expect(res.json).toHaveBeenCalledWith(['history']);
  });
});
