import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import * as dotenv from 'dotenv';
import { GroupRepository } from './group.repository';
dotenv.config();

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.INVITATION_QUEUE,
    }),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, PrismaService],
})
export class GroupModule {}
