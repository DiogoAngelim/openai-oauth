// __mocks__/openai.mock.ts
export const openaiCreateMock = jest.fn(async () => ({
  choices: [{ message: { content: 'mocked response' } }],
  usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
}))
export function openaiMockFactory (): {
  chat: {
    completions: {
      create: typeof openaiCreateMock
    }
  }
} {
  return {
    chat: {
      completions: {
        create: openaiCreateMock
      }
    }
  }
}
