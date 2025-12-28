import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof postgres>;
  private db: ReturnType<typeof drizzle>;

  onModuleInit() {
    // Use environment variables for connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    this.client = postgres(connectionString, { max: 1 });
    this.db = drizzle(this.client);
  }

  getDb() {
    return this.db;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
    }
  }

  // Add explicit return types and handle nullable values

  getConnection(): ConnectionType | null {
    if (this.connection !== null && this.connection !== undefined) {
      return this.connection;
    }
    return null;
  }

  someMethod(): void {
    const value: string | null = this.getValue();
    if (value !== null && value !== "") {
      // handle value
    }
  }
}
