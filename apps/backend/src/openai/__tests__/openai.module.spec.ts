import { OpenAIModule } from '../openai.module'
import { Test, TestingModule } from '@nestjs/testing'
import { OpenAIService } from '../openai.service'
import { OpenAIController } from '../openai.controller'
import { OpenAIRateLimitGuard } from '../openai.guard'
import { RateLimitService } from '../../rate-limit/rate-limit.service'
import { Module } from '@nestjs/common'

describe('OpenAIModule', () => {
  it('should be defined', () => {
    expect(OpenAIModule).toBeDefined()
  })

  it('should compile and provide OpenAIService and OpenAIController', async () => {
    class MockRateLimitService {
      check = jest.fn()
    }
    @Module({})
    class MockAuthModule {}
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockAuthModule],
      providers: [
        OpenAIService,
        { provide: RateLimitService, useClass: MockRateLimitService },
        OpenAIRateLimitGuard
      ],
      controllers: [OpenAIController]
    }).compile()
    const service = module.get(OpenAIService)
    const controller = module.get(OpenAIController)
    expect(service).toBeInstanceOf(OpenAIService)
    expect(controller).toBeInstanceOf(OpenAIController)
  })
})
