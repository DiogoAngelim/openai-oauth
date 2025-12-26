import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { AuthModule } from '../auth/auth.module';
// ...existing code...


import { prisma } from '../prisma';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: OpenAIService,
      useFactory: () => new OpenAIService(prisma),
    },
  ],
  controllers: [OpenAIController],
  exports: [OpenAIService],
})
export class OpenAIModule { }
