// __mocks__/prisma-client.mock.ts
export function prismaMockFactory(): {
  user: { findUnique: jest.Mock; create: jest.Mock };
  organization: { create: jest.Mock; findUnique: jest.Mock };
  membership: { findFirst: jest.Mock };
  refreshToken: { create: jest.Mock; findUnique: jest.Mock };
  openAIUsageLog: { aggregate: jest.Mock; create: jest.Mock };
} {
  return {
    user: { findUnique: jest.fn(), create: jest.fn() },
    organization: { create: jest.fn(), findUnique: jest.fn() },
    membership: { findFirst: jest.fn() },
    refreshToken: { create: jest.fn(), findUnique: jest.fn() },
    openAIUsageLog: { aggregate: jest.fn(), create: jest.fn() },
  };
}
