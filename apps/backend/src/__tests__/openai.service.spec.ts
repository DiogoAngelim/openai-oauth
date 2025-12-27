// No top-level exception imports needed
import { OpenAIService } from '../openai/openai.service';
import { openaiCreateMock as oaiMock, openaiMockFactory } from '../__mocks__/openai.mock';
import { prismaMockFactory } from '../__mocks__/prisma-client.mock';

describe('OpenAIService', () => {
  let service: OpenAIService;
  let openaiCreateMock: jest.Mock;
  let prismaInstance: ReturnType<typeof prismaMockFactory>;
  beforeEach(() => {
    jest.resetModules();
    openaiCreateMock = oaiMock;
    prismaInstance = prismaMockFactory() as jest.Mocked<import('@prisma/client').PrismaClient>;
    jest.doMock('openai', () => ({
      default: jest.fn().mockImplementation(openaiMockFactory)
    }));
    jest.doMock('@prisma/client', () => ({
      PrismaClient: jest.fn().mockImplementation(() => prismaInstance)
    }));
    service = new OpenAIService(prismaInstance);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle prompt input', async () => {
    const prisma = (service as import('../openai/openai.service').OpenAIService)._prismaInstance;
    prisma.organization.findUnique.mockResolvedValue({ id: 'org1', subscription: { monthlyQuota: 1000 } });
    prisma.openAIUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 0 } });
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'hi' }, false)).resolves.toBeDefined();
  });

  it('should throw BadRequestException for invalid prompt', async () => {
    await expect(service.createChatCompletion('org1', 'user1', { prompt: '' }, false)).rejects.toThrow(
      expect.objectContaining({ name: 'BadRequestException' })
    );
  });

  it('should throw ForbiddenException for forbidden prompt', async () => {
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'api_key' }, false)).rejects.toThrow(
      expect.objectContaining({ name: 'ForbiddenException' })
    );
  });

  it('should throw ForbiddenException if quota exceeded', async () => {
    const prisma = (service as import('../openai/openai.service').OpenAIService)._prismaInstance;
    prisma.organization.findUnique.mockResolvedValue({ subscription: { monthlyQuota: 1 } });
    prisma.openAIUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 1000 } });
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'hi' }, false)).rejects.toThrow(
      expect.objectContaining({ name: 'ForbiddenException' })
    );
  });

  it('should handle streaming', async () => {
    const prisma = (service as import('../openai/openai.service').OpenAIService)._prismaInstance;
    prisma.organization.findUnique.mockResolvedValue({ id: 'org1', subscription: { monthlyQuota: 1000 } });
    prisma.openAIUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 0 } });
    // Patch OpenAI mock for streaming
    const streamData = [{ choices: [{ delta: { content: 'A' } }] }, { choices: [{ delta: { content: 'B' } }] }];
    openaiCreateMock.mockImplementation(async function* () {
      for (const chunk of streamData) yield chunk;
    });
    const onData = jest.fn();
    await service.createChatCompletion('org1', 'user1', { prompt: 'hi' }, true, onData);
    expect(onData).toHaveBeenCalledWith('A');
    expect(onData).toHaveBeenCalledWith('B');
  });

  it('should throw ForbiddenException if org not found', async () => {
    const prisma = (service as OpenAIService)._prismaInstance;
    prisma.organization.findUnique.mockResolvedValue(null);
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'hi' }, false)).rejects.toThrow(
      expect.objectContaining({ name: 'ForbiddenException' })
    );
  });
});
