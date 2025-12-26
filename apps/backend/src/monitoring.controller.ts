
import { Controller, Get, Res } from '@nestjs/common';
import { registry } from './monitoring';
import { FastifyReply } from 'fastify';

@Controller('metrics')
export class MonitoringController {
  @Get()
  async metrics(@Res({ passthrough: true }) reply: any): Promise<void> {
    if (typeof reply.setHeader === 'function') {
      reply.setHeader('Content-Type', registry.contentType);
    } else if (typeof reply.header === 'function') {
      reply.header('Content-Type', registry.contentType);
    }
    if (typeof reply.send === 'function') {
      reply.send(await registry.metrics());
    } else if (typeof reply.end === 'function') {
      reply.end();
    }
  }
}
