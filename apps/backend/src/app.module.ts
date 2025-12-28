import { Module, Controller, Get } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ApiModule } from './api/api.module'
import { OpenAIModule } from './openai/openai.module'
import { RateLimitModule } from './rate-limit/rate-limit.module'
import { MonitoringModule } from './monitoring.module'
import { ComplianceController } from './compliance.controller'
import { BillingModule } from './billing.module'
import { AdminController } from './admin.controller'

@Controller('/')
class HealthController {
  @Get('health')
  health (): { status: string } {
    return { status: 'ok' }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ApiModule,
    OpenAIModule,
    RateLimitModule,
    BillingModule,
    MonitoringModule
  ],
  controllers: [ComplianceController, AdminController, HealthController],
  providers: []
})
export class AppModule {}
