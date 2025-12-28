
import { Controller, Get, Res } from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { registry } from './monitoring'

@Controller('metrics')
export class MonitoringController {
  @Get()
  async metrics (@Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    if (typeof reply.header === 'function') {
      reply.header('Content-Type', registry.contentType)
    }
    if (typeof reply.send === 'function') {
      reply.send(await registry.metrics())
    }
  }
}
