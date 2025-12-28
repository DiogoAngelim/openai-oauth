import { Controller, Post, Get, Req, Res, UseGuards, Body, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { OpenAIService } from './openai.service'
import { OpenAIRateLimitGuard } from './openai.guard'
import { Request, Response } from 'express'

@Controller('openai')
@UseGuards(JwtAuthGuard, OpenAIRateLimitGuard)
export class OpenAIController {
  constructor (private readonly openai: OpenAIService) { }

  @Post('chat')
  async chat (
    @Req() req: Request & { user: { orgId: string, sub: string } },
      @Res() res: Response,
      @Body() body: { prompt: string, model?: string, max_tokens?: number, stream?: boolean },
      @Query('stream') stream: string
  ): Promise<void> {
    const orgId = req.user.orgId
    const userId = req.user.sub
    if (stream === 'true') {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      await this.openai.createChatCompletion(orgId, userId, body, true, (chunk: string) => {
        res.write(`data: ${chunk}\n\n`)
      })
      res.end()
    } else {
      const result = await this.openai.createChatCompletion(orgId, userId, body, false)
      res.json(result)
    }
  }

  @Get('history')
  async getHistory (
    @Req() req: Request & { user: { orgId: string, sub: string } },
      @Res() res: Response
  ): Promise<void> {
    const orgId = req.user.orgId
    const userId = req.user.sub
    const history = await this.openai.getUserChatHistory(orgId, userId)
    res.json(history)
  }
}

// In test context, mock OpenAIService and all external dependencies
