import { Controller, Delete, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

@Controller('compliance')
@UseGuards(JwtAuthGuard)
export class ComplianceController {
  @Delete('delete-account')
  async deleteAccount (): Promise<{ status: string }> {
    // TODO: Implement user/org data deletion logic
    return { status: 'Account and data deleted (stub)' }
  }
}
