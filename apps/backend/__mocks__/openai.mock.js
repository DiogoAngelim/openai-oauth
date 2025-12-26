// __mocks__/openai.mock.js
/* global jest */
const openaiCreateMock = jest.fn().mockResolvedValue({
  usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
  choices: [{ message: { content: 'ok' } }]
});

const openaiMockFactory = () => ({
  chat: {
    completions: {
      create: (...args) => openaiCreateMock(...args)
    }
  }
});

module.exports = { openaiCreateMock, openaiMockFactory };
