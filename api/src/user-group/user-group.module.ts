import { Module } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [UserGroupService, PrismaService],
  controllers: [UserGroupController],
})
export class UserGroupModule {}
