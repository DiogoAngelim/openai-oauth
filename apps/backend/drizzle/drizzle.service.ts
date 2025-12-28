import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof postgres>
  private db: ReturnType<typeof drizzle>

  onModuleInit (): void {
    // Use environment variables for connection
    const connectionString = process.env.DATABASE_URL
    if (typeof connectionString !== 'string' || connectionString === '') {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    this.client = postgres(connectionString, { max: 1 })
    this.db = drizzle(this.client)
  }

  getDb (): ReturnType<typeof drizzle> {
    return this.db
  }

  async onModuleDestroy (): Promise<void> {
    if (typeof this.client !== 'undefined' && this.client !== null) {
      await this.client.end()
    }
  }
}
