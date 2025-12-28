import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard, Roles } from '../auth/roles.guard'

interface JwtUser {
  orgId: string
  role: string
  [key: string]: unknown
}

@Controller('api')
@UseGuards(JwtAuthGuard)
export class ApiController {
  @Get('me')
  async me (@Req() req: { user: JwtUser }): Promise<{ user: JwtUser, orgId: string, role: string }> {
    // User info from JWT
    return {
      user: req.user,
      orgId: req.user.orgId,
      role: req.user.role
    }
  }

  @Get('admin')
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesGuard)
  async adminOnly (@Req() req: { user: JwtUser }): Promise<{ message: string, user: JwtUser }> {
    return { message: 'Admin/Owner access granted', user: req.user }
  }
}
