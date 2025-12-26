import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { AuthModule } from '../auth/auth.module';
// ...existing code...

@Module({
  imports: [AuthModule],
  providers: [OpenAIService],
  controllers: [OpenAIController],
  exports: [OpenAIService],
})
export class OpenAIModule { }
