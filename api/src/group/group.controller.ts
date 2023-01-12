import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGroupEntity } from './entities/create-group.entity';
import { GroupEntity } from './entities/group.entity';
import { UpdateGroupEntity } from './entities/update-group.entity';
import { GroupService } from './group.service';
import { IsGroupAdminGuard } from './guards/is-group-admin.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: GroupEntity })
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<Partial<Group>> {
    const group = await this.groupService.group({ id: Number(id) });
    return group;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  @Get('/user/:id')
  async getGroupsByUserId(@Param('id') id: string): Promise<Group[]> {
    const groups = await this.groupService.groups({
      where: {
        OR: [
          { admin: { id: Number(id) } },
          { members: { some: { userId: { equals: Number(id) } } } },
        ],
      },
    });
    return groups;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: GroupEntity })
  @Post()
  async createGroup(@Body() group: CreateGroupEntity): Promise<Group> {
    const { adminId, ...rest } = group;
    const createdGroup = await this.groupService.createGroup({
      ...rest,
      admin: { connect: { id: Number(adminId) } },
    });
    return createdGroup;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: GroupEntity })
  @Put('/:id')
  async updateGroup(
    @Param('id') id: string,
    @Body() group: UpdateGroupEntity,
  ): Promise<Group> {
    const updatedGroup = await this.groupService.updateGroup({
      where: { id: Number(id) },
      data: group,
    });
    return updatedGroup;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: GroupEntity })
  @Post('/:id/members')
  async addGroupInvite(
    @Param('id') id: string,
    @Body() members: { email: string }[],
  ): Promise<Group> {
    const group = await this.groupService.createGroupInvitations({
      groupId: Number(id),
      emails: members,
    });
    return group;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: GroupEntity })
  @Put('/:id/members')
  async acceptGroupInvite(
    @Param('id') id: string,
    @Body() member: { email: string },
  ): Promise<Group> {
    const group = await this.groupService.acceptGroupInvite({
      groupId: Number(id),
      email: member.email,
    });
    return group;
  }

  @UseGuards(JwtAuthGuard, IsGroupAdminGuard)
  @ApiOkResponse({ type: GroupEntity })
  @Delete('/:id')
  async deleteGroup(@Param('id') id: string): Promise<Group> {
    const deletedGroup = await this.groupService.deleteGroup({
      id: Number(id),
    });
    return deletedGroup;
  }
}
