import * as OpenaiIndex from '../index'

describe('Openai Index', () => {
  it('should export expected members', () => {
    expect(OpenaiIndex).toBeDefined()
  })

  it('should export OpenAIModule, OpenAIService, OpenAIController, OpenAIRateLimitGuard', () => {
    expect(OpenaiIndex.OpenAIModule).toBeDefined()
    expect(OpenaiIndex.OpenAIService).toBeDefined()
    expect(OpenaiIndex.OpenAIController).toBeDefined()
    expect(OpenaiIndex.OpenAIRateLimitGuard).toBeDefined()
  })
})
