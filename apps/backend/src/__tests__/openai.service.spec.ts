// No top-level exception imports needed
describe('OpenAIService', () => {
  let service: any;
  let openaiCreateMock: any;
  let prismaInstance: any;
  beforeEach(() => {
    jest.resetModules();
    const { openaiCreateMock: oaiMock, openaiMockFactory } = require('../../__mocks__/openai.mock');
    const { prismaMockFactory } = require('../../__mocks__/prisma-client.mock');
    openaiCreateMock = oaiMock;
    prismaInstance = prismaMockFactory();
    jest.doMock('openai', () => ({
      default: jest.fn().mockImplementation(openaiMockFactory)
    }));
    jest.doMock('@prisma/client', () => ({
      PrismaClient: jest.fn().mockImplementation(() => prismaInstance)
    }));
    const { OpenAIService } = require('../openai/openai.service');
    service = new OpenAIService();
    service._prismaInstance = prismaInstance;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle prompt input', async () => {
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
    const prisma = (service as any)._prismaInstance;
    prisma.organization.findUnique.mockResolvedValue({ subscription: { monthlyQuota: 1 } });
    prisma.openAIUsageLog.aggregate.mockResolvedValue({ _sum: { totalTokens: 1000 } });
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'hi' }, false)).rejects.toThrow(
      expect.objectContaining({ name: 'ForbiddenException' })
    );
  });

  it('should handle streaming', async () => {
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
    const prisma = (service as any)._prismaInstance;
    prisma.organization.findUnique.mockResolvedValue(null);
    await expect(service.createChatCompletion('org1', 'user1', { prompt: 'hi' }, false)).rejects.toThrow(
      expect.objectContaining({ name: 'ForbiddenException' })
    );
  });
});
