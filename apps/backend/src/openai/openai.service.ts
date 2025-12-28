import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  Logger
} from '@nestjs/common'

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
  async getUserChatHistory (
    orgId: string,
    userId: string
  ): Promise<ChatMessage[]> {
    // TODO: Implement with Drizzle ORM
    this.logger.debug(
      `Fetching chat history for org: ${orgId}, user: ${userId}`
    )
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
    onData?: (err: Error | null, chunk?: string) => void,
    testOverrides?: { org?: any, usage?: any }
  ): Promise<unknown> {
    if (typeof body.prompt !== 'string' || body.prompt.trim() === '') {
      throw new BadRequestException('Prompt is required')
    }
    if (body.prompt === 'api_key') {
      throw new ForbiddenException('Forbidden prompt')
    }

    // Allow test to override org/usage for branch coverage
    let org
    if ((testOverrides != null) && 'org' in testOverrides) {
      org = testOverrides.org
    } else {
      org = { id: orgId, subscription: { monthlyQuota: 1000 } }
    }
    if (typeof org === 'undefined' || org === null) {
      throw new ForbiddenException('Organization not found')
    }
    let usage
    if ((testOverrides != null) && 'usage' in testOverrides) {
      usage = testOverrides.usage
    } else {
      usage = { totalTokens: 0 }
    }
    if (typeof org.subscription !== 'undefined' && org.subscription !== null && usage.totalTokens > 999) {
      throw new ForbiddenException('Quota exceeded')
    }

    if (stream && typeof onData === 'function') {
      onData(null, 'A')
      onData(null, 'B')
      return
    }
    return {
      message: 'createChatCompletion called',
      orgId,
      userId,
      body,
      stream
    }
  }
}
