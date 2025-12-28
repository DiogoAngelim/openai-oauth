import { Injectable } from '@nestjs/common'

@Injectable()
export class BillingService {
  // TODO: Integrate with Stripe or Paddle
  async createCheckoutSession (): Promise<{ url: string }> {
    return { url: 'https://billing.example.com/checkout' }
  }
}
