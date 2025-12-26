import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  // Sentry Express error handler is not applicable for Fastify
  // TypeScript workaround: cast FastifyAdapter to AbstractHttpAdapter to resolve type mismatch error.
  // WARNING: This should only be used if @nestjs/core and @nestjs/platform-fastify are truly aligned.
  const adapter = new FastifyAdapter() as unknown as AbstractHttpAdapter<any, any, any>;
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.enableCors({
    origin: typeof process.env.FRONTEND_URL === 'string' && process.env.FRONTEND_URL.length > 0 ? process.env.FRONTEND_URL : 'http://localhost:3000',
    credentials: true,
  });
  // Use logger middleware for all routes (Fastify)
  const fastify = app.getHttpAdapter().getInstance();
  const logger = (await import('./logger')).default;
  fastify.addHook('onResponse', (request, reply, done) => {
    const { method, url } = request.raw;
    const { statusCode } = reply.raw;
    const duration = reply.getResponseTime ? reply.getResponseTime() : undefined;
    logger.info('%s %s %d %s', method, url, statusCode, duration ? `${duration}ms` : '');
    done();
  });
  // Sentry error handler
  // Sentry error handler not available for Fastify in this context
  await app.listen(4001, '0.0.0.0');
}
bootstrap();
