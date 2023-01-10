import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { BullModule } from '@nestjs/bull';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.ACTIVATION_QUEUE,
    }),
  ],
  providers: [UserService, PrismaService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
