import { Module, Global } from "@nestjs/common";
import { RateLimitService } from "./rate-limit.service";
import { ConfigModule } from "@nestjs/config";

import Redis from "ioredis";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "REDIS",
      useFactory: () => new Redis(process.env.REDIS_URL!),
    },
    {
      provide: RateLimitService,
      useFactory: (redis: Redis) => new RateLimitService(redis),
      inject: ["REDIS"],
    },
  ],
  exports: [RateLimitService],
})
export class RateLimitModule {}
