// __mocks__/prisma-client.mock.ts
export function prismaMockFactory() {
  return {
    user: { findUnique: jest.fn(), create: jest.fn() },
    organization: { create: jest.fn(), findUnique: jest.fn() },
    membership: { findFirst: jest.fn() },
    refreshToken: { create: jest.fn(), findUnique: jest.fn() },
    openAIUsageLog: { aggregate: jest.fn(), create: jest.fn() },
  };
}
