import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { BullModule } from '@nestjs/bull';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserRepository } from './user.repository';
dotenv.config();

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.ACTIVATION_QUEUE,
    }),
    BullModule.registerQueue({
      name: process.env.FORGOT_PASSWORD_QUEUE,
    }),
  ],
  providers: [UserService, UserRepository, PrismaService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
