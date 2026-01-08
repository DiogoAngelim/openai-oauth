import { Module, Controller, Get } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ApiModule } from './api/api.module'
import { OpenAIModule } from './openai/openai.module'
import { MonitoringModule } from './monitoring.module'
import { BillingModule } from './billing.module'
import { AdminController } from './admin.controller'

@Controller('/')
class HealthController {
  @Get('health')
  health(): { status: string } {
    return { status: 'ok' }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ApiModule,
    OpenAIModule,
    // RateLimitModule, // Disabled for local/dev to avoid Redis dependency
    BillingModule,
    MonitoringModule
  ],
  // controllers: [ComplianceController, AdminController, HealthController],
  controllers: [AdminController, HealthController],
  providers: []
})
export class AppModule { }
