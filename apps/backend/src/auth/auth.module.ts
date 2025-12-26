import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
    {
      provide: AuthService,
      useFactory: (jwtService, prisma) => new AuthService(jwtService, prisma),
      inject: [JwtService, 'PRISMA'],
    },
    GoogleStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
