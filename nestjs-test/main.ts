import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

@Controller('/')
class HealthController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}

@Module({
  controllers: [HealthController],
})
class AppModule { }

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(5001);
  console.log('Minimal NestJS app listening on port 5001');
}

bootstrap();
