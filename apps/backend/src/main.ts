// Log all unhandled errors for container debugging
import * as dotenv from 'dotenv'
import * as path from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err)
  process.exit(1)
})

dotenv.config({ path: path.join(__dirname, '../.env') })
console.log('GOOGLE_CLIENT_ID at startup:', process.env.GOOGLE_CLIENT_ID)
console.log('GOOGLE_CLIENT_ID at startup:', process.env.GOOGLE_CLIENT_ID)

// Add explicit return type and handle promise
async function bootstrap (): Promise<void> {
  // Sentry error handler not available for Fastify in this context
  const port = 4000
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.enableCors({
      origin: 'http://localhost:3001',
      credentials: true
    })
    await app.listen(port)
    console.log(`Backend listening on port ${port}`)
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error(`Port ${port} is busy or failed:`, errorMsg)
    process.exit(1)
  }
}
void bootstrap()
