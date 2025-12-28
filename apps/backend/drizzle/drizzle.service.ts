import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof postgres>
  private db: ReturnType<typeof drizzle>

  onModuleInit () {
    // Use environment variables for connection
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    this.client = postgres(connectionString, { max: 1 })
    this.db = drizzle(this.client)
  }

  getDb () {
    return this.db
  }

  async onModuleDestroy () {
    if (this.client) {
      await this.client.end()
    }
  }
}
