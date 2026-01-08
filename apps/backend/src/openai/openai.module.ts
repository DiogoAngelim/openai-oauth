import { Module } from '@nestjs/common'
import { OpenAIService } from './openai.service'
import { OpenAIController } from './openai.controller'
import { AuthModule } from '../auth/auth.module'
// ...existing code...

import { ConfigService } from '@nestjs/config'
import { DrizzleService } from '../../drizzle/drizzle.service'

@Module({
  imports: [AuthModule],
  providers: [OpenAIService, ConfigService, DrizzleService],
  controllers: [OpenAIController],
  exports: [OpenAIService]
})
export class OpenAIModule { }
