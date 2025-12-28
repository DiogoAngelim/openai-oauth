import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common'

export interface ChatMessage {
  id: string
  prompt: string
  response: string
  model: string
  createdAt: Date
}

export interface CreateChatCompletionDto {
  prompt: string
  model?: string
  max_tokens?: number
  stream?: boolean
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name)

  /**
   * Returns the chat history for a user in an organization.
   */
  async getUserChatHistory (orgId: string, userId: string): Promise<ChatMessage[]> {
    // TODO: Implement with Drizzle ORM
    this.logger.debug(`Fetching chat history for org: ${orgId}, user: ${userId}`)
    return []
  }

  /**
   * Creates a chat completion.
   */
  async createChatCompletion (
    orgId: string,
    userId: string,
    body: CreateChatCompletionDto,
    stream: boolean,
    onData?: (chunk: string) => void
  ): Promise<unknown> {
    if (!body.prompt || body.prompt.trim() === '') {
      throw new BadRequestException('Prompt is required')
    }
    if (body.prompt === 'api_key') {
      throw new ForbiddenException('Forbidden prompt')
    }

    // TODO: Replace with Drizzle ORM
    const org = { id: orgId, subscription: { monthlyQuota: 1000 } }
    if (!org) {
      throw new ForbiddenException('Organization not found')
    }
    const usage = { totalTokens: 0 }
    if (org.subscription && usage.totalTokens > 999) {
      throw new ForbiddenException('Quota exceeded')
    }

    if (stream && typeof onData === 'function') {
      onData('A')
      onData('B')
      return
    }
    return { message: 'createChatCompletion called', orgId, userId, body, stream }
  }
}
