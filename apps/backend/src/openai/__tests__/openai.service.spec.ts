import { OpenAIService } from '../openai.service';

describe('OpenAIService', () => {
  let service: OpenAIService;
  let prismaMock: {
    organization: { findUnique: jest.Mock };
    openAIUsageLog: { aggregate: jest.Mock };
    chatMessage: { findMany: jest.Mock };
  };

  beforeEach(() => {
    prismaMock = {
      organization: { findUnique: jest.fn() },
      openAIUsageLog: { aggregate: jest.fn() },
      chatMessage: { findMany: jest.fn() }
    };
    service = new OpenAIService(prismaMock);
  });

  it('should throw BadRequestException for empty prompt', async () => {
    await expect(service.createChatCompletion('org1', 'user1', { prompt: '' }, false)).rejects.toThrow('Prompt is required');
  });

  it('should throw ForbiddenException for forbidden prompt', async () => {
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'api_key' }, false)).rejects.toThrow('Forbidden prompt');
  });

  it('should throw ForbiddenException if org not found', async () => {
    prismaMock.organization.findUnique.mockResolvedValue(null);
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'Hello' }, false)).rejects.toThrow('Organization not found');
  });

  it('should throw ForbiddenException if quota exceeded', async () => {
    prismaMock.organization.findUnique.mockResolvedValue({ subscription: { monthlyQuota: 1000 } });
    prismaMock.openAIUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 1001 } });
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'Hello' }, false)).rejects.toThrow('Quota exceeded');
  });

  it('should call onData for streaming', async () => {
    prismaMock.organization.findUnique.mockResolvedValue({ subscription: { monthlyQuota: 1000 } });
    prismaMock.openAIUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 1 } });
    const onData = jest.fn();
    await service.createChatCompletion('org1', 'user1', { prompt: 'Hello' }, true, onData);
    expect(onData).toHaveBeenCalledWith('A');
    expect(onData).toHaveBeenCalledWith('B');
  });

  it('should return result for non-stream', async () => {
    prismaMock.organization.findUnique.mockResolvedValue({ subscription: { monthlyQuota: 1000 } });
    prismaMock.openAIUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 1 } });
    const result = await service.createChatCompletion('org1', 'user1', { prompt: 'Hello' }, false);
    expect(result).toHaveProperty('message');
  });

  it('should get user chat history', async () => {
    prismaMock.chatMessage.findMany.mockResolvedValue([{ id: '1', prompt: 'Hello', response: 'Hi', model: 'gpt', createdAt: new Date() }]);
    const history = await service.getUserChatHistory('org1', 'user1');
    expect(history.length).toBe(1);
  });
});
