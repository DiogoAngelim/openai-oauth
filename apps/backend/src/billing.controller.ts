import { Controller, Post } from '@nestjs/common'
import { BillingService } from './billing.service'

@Controller('billing')
export class BillingController {
  constructor (private readonly billing: BillingService) {}

  @Post('checkout')
  async checkout (): Promise<unknown> {
    return await this.billing.createCheckoutSession()
  }
}
