import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, PrismaService],
})
export class GroupModule {}
