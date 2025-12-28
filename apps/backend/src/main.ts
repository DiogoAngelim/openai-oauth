// Log all unhandled errors for container debugging
import * as dotenv from 'dotenv'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'

// removed duplicate declaration
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { getLogger } from './logger'
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err)
  process.exit(1)
})
dotenv.config()

// Add explicit return type and handle promise
async function bootstrap (): Promise<void> {
  // Sentry Express error handler is not applicable for Fastify
  // TypeScript workaround: cast FastifyAdapter to AbstractHttpAdapter to resolve type mismatch error.
  // WARNING: This should only be used if @nestjs/core and @nestjs/platform-fastify are truly aligned.
  const adapter = new FastifyAdapter() as unknown as AbstractHttpAdapter<
  unknown,
  unknown,
  unknown
  >
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter
  )
  app.enableCors({
    origin:
      typeof process.env.FRONTEND_URL === 'string' &&
      process.env.FRONTEND_URL.length > 0
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true
  })
  // Use logger middleware for all routes (Fastify)
  const fastify = app.getHttpAdapter().getInstance()
  const logger = getLogger()
  fastify.addHook('onResponse', (request, reply, done) => {
    const { method, url } = request.raw
    const { statusCode } = reply.raw
    const duration =
      typeof reply.getResponseTime === 'function'
        ? reply.getResponseTime()
        : undefined
    logger.info(
      '%s %s %d %s',
      method,
      url,
      statusCode,
      typeof duration === 'number' && !isNaN(duration) && duration > 0
        ? `${duration}ms`
        : ''
    )
    done()
  })
  // Sentry error handler
  // Sentry error handler not available for Fastify in this context
  const ports = [4000, 4001, 4002, 4003]
  let started = false
  for (const port of ports) {
    try {
      await app.listen(port, '0.0.0.0')
      console.log(`Backend listening on http://0.0.0.0:${port}`)
      console.log('Health endpoint available at /health')
      started = true
      break
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error(`Port ${port} is busy or failed:`, errorMsg)
    }
  }
  if (!started) {
    console.error('Failed to start backend on any port 4000-4003')
    process.exit(1)
  }
  // Keep the event loop alive for debugging (prevents process exit)

  setInterval(() => {}, 1000 * 60 * 60)
}
void bootstrap()
