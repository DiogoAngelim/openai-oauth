// __mocks__/prisma-client.mock.js
const prismaMockFactory = () => ({
  organization: { findUnique: jest.fn().mockResolvedValue({ subscription: { monthlyQuota: 10000 } }) },
  openAIUsageLog: { aggregate: jest.fn().mockResolvedValue({ _sum: { totalTokens: 0 } }), create: jest.fn() },
  user: { findUnique: jest.fn(), create: jest.fn() },
  membership: { findFirst: jest.fn() },
  refreshToken: { create: jest.fn(), findUnique: jest.fn() }
});

module.exports = { prismaMockFactory };
