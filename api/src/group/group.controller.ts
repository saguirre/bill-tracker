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
      where: { members: { some: { id: Number(id) } } },
    });
    return groups;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: GroupEntity })
  @Post()
  async createGroup(@Body() group: CreateGroupEntity): Promise<Group> {
    const createdGroup = await this.groupService.createGroup({
      ...group,
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
  @ApiOkResponse({ type: GroupEntity })
  @Delete('/:id')
  async deleteGroup(@Param('id') id: string): Promise<Group> {
    const deletedGroup = await this.groupService.deleteGroup({
      id: Number(id),
    });
    return deletedGroup;
  }
}
