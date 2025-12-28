import * as schema from '../db/schema'

describe('db schema', () => {
  it('should export users, organizations, memberships, refreshTokens', () => {
    expect(schema).toHaveProperty('users')
    expect(schema).toHaveProperty('organizations')
    expect(schema).toHaveProperty('memberships')
    expect(schema).toHaveProperty('refreshTokens')
  })
})
