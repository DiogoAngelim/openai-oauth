import { DrizzleService } from '../../drizzle/drizzle.service'

describe('DrizzleService', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })
  afterEach(() => {
    process.env = OLD_ENV
  })

  it('should throw if DATABASE_URL is not set', () => {
    delete process.env.DATABASE_URL
    const service = new DrizzleService()
    expect(() => service.onModuleInit()).toThrow('DATABASE_URL environment variable is not set')
  })

  it('should initialize client and db if DATABASE_URL is set', async () => {
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db'
    const mockClient = {} as any
    const mockDb = {} as any
    jest.mock('postgres', () => () => mockClient)
    jest.mock('drizzle-orm/postgres-js', () => ({ drizzle: () => mockDb }))
    // Use import instead of require for DrizzleService if possible
    const { DrizzleService: FreshDrizzleService } = await import('../../drizzle/drizzle.service')
    const service = new FreshDrizzleService()
    service.onModuleInit()
    expect(service.getDb()).toBe(mockDb)
  })

  it('should call client.end on destroy', async () => {
    const service = new DrizzleService()
    const end = jest.fn()
    // @ts-expect-error: Mocking private client property for test
    service.client = { end }
    await service.onModuleDestroy()
    expect(end).toHaveBeenCalled()
  })

  it('should not throw if client is undefined on destroy', async () => {
    const service = new DrizzleService()
    // @ts-expect-error: Intentionally setting client to undefined for test
    service.client = undefined
    await expect(service.onModuleDestroy()).resolves.toBeUndefined()
  })
})
