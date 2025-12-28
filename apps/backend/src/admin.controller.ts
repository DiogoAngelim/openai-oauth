import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { RolesGuard, Roles } from './auth/roles.guard'

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('ADMIN', 'OWNER')
  dashboard (): { status: string } {
    // TODO: Implement admin dashboard logic
    return { status: 'Admin dashboard (stub)' }
  }
}
