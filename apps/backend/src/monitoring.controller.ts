
import { Controller, Get, Res } from '@nestjs/common';
import { registry } from './monitoring';
import { FastifyReply } from 'fastify';

@Controller('metrics')
export class MonitoringController {
  @Get()
  async metrics(@Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    reply.header('Content-Type', registry.contentType);
    reply.send(await registry.metrics());
  }
}
