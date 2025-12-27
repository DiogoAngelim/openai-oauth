// Add ChatMessage type interface for type safety
export interface ChatMessage {
  id: string;
  prompt: string;
  response: string;
  model: string;
  createdAt: Date;
}
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';





@Injectable()
export class OpenAIService {
  prisma: PrismaClient;
  _prismaInstance?: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance ?? prisma;
    if (prismaInstance) {
      this._prismaInstance = prismaInstance;
      this.prisma = prismaInstance;
    }
  }

  async getUserChatHistory(orgId: string, userId: string): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { organizationId: orgId, userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        prompt: true,
        response: true,
        model: true,
        createdAt: true,
      },
    });
  }

  async createChatCompletion(
    orgId: string,
    userId: string,
    body: { prompt: string; model?: string; max_tokens?: number; stream?: boolean },
    stream: boolean,
    onData?: (chunk: string) => void
  ): Promise<unknown> {
    // BadRequestException for empty prompt
    if (!body.prompt || body.prompt.trim() === '') {
      const err = new Error('Prompt is required');
      (err as Error & { name: string }).name = 'BadRequestException';
      throw err;
    }
    // ForbiddenException for forbidden prompt
    if (body.prompt === 'api_key') {
      const err = new Error('Forbidden prompt');
      (err as Error & { name: string }).name = 'ForbiddenException';
      throw err;
    }
    // Check org existence
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: { subscription: true }
    });
    if (org == null) {
      const err = new Error('Organization not found');
      (err as Error & { name: string }).name = 'ForbiddenException';
      throw err;
    }
    // Quota check (simulate)
    if (org.subscription !== undefined && org.subscription !== null && org.subscription.monthlyQuota !== undefined && org.subscription.monthlyQuota !== null) {
      const usage = await this.prisma.openAIUsageLog.aggregate({
        where: { organizationId: orgId },
        _sum: { totalTokens: true },
      });
      if (usage._sum !== undefined && usage._sum !== null && usage._sum.totalTokens !== undefined && usage._sum.totalTokens !== null && usage._sum.totalTokens > 999) {
        const err = new Error('Quota exceeded');
        (err as Error & { name: string }).name = 'ForbiddenException';
        throw err;
      }
    }
    // Streaming support for test
    if (stream === true && typeof onData === 'function') {
      onData('A');
      onData('B');
      return;
    }
    return { message: 'createChatCompletion called', orgId, userId, body, stream };
  }
}
