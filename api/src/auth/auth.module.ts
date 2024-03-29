import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { PrismaService } from '../prisma.service';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { BullModule } from '@nestjs/bull';
import * as dotenv from 'dotenv';
import { UserRepository } from 'src/user/user.repository';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    UserModule,
    {
      ...JwtModule.register({
        secret: `${process.env.JWT_SECRET}`,
        signOptions: { expiresIn: '7d' },
      }),
      global: true,
    },
    BullModule.registerQueue({
      name: process.env.ACTIVATION_QUEUE,
    }),
    BullModule.registerQueue({
      name: process.env.FORGOT_PASSWORD_QUEUE,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    PrismaService,
    JwtService,
    UserRepository,
    JwtStrategy,
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
