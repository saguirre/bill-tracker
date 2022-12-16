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
import { UserGroup, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserGroupEntity } from './entities/create-user-group.entity';
import { UserGroupEntity } from './entities/user-group.entity';
import { UserGroupService } from './user-group.service';

@Controller('user-group')
export class UserGroupController {
  constructor(private userGroupService: UserGroupService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserGroupEntity })
  @Get(':id')
  async getUserGroupById(@Param('id') id: string): Promise<Partial<UserGroup>> {
    const userGroup = await this.userGroupService.userGroup({ id: Number(id) });
    return userGroup;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserGroupEntity, isArray: true })
  @Get()
  async getUserGroups(): Promise<UserGroup[]> {
    const userGroups = await this.userGroupService.userGroups({});
    return userGroups;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserGroupEntity, isArray: true })
  @Get('/user/:id')
  async getUserGroupsByUserId(@Param('id') id: string): Promise<UserGroup[]> {
    const userGroups = await this.userGroupService.userGroups({
      where: {
        members: {
          some: { id: Number(id) },
        },
      },
    });
    return userGroups;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserGroupEntity, isArray: true })
  @Get('/group/:id')
  async getUserGroupsByGroupId(@Param('id') id: string): Promise<UserGroup[]> {
    const userGroups = await this.userGroupService.userGroups({
      where: { id: Number(id) },
    });
    return userGroups;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserGroupEntity })
  @Post()
  async createUserGroup(
    @Body() createUserGroupInput: CreateUserGroupEntity,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupService.createUserGroup(
      createUserGroupInput,
    );
    return userGroup;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserGroupEntity })
  @Post('/group/:groupId/user/:id')
  async addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupService.addUserToGroup({
      groupId: Number(groupId),
      userId: Number(id),
    });
    return userGroup;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserGroupEntity })
  @Delete('/group/:groupId/user/:id')
  async removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupService.removeUserFromGroup({
      groupId: Number(groupId),
      userId: Number(id),
    });
    return userGroup;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserGroupEntity })
  @Put(':id')
  async updateUserGroup(
    @Param('id') id: string,
    @Body() updateUserGroupInput: Prisma.UserGroupUpdateInput,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupService.updateUserGroup({
      data: updateUserGroupInput,
      where: { id: Number(id) },
    });
    return userGroup;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserGroupEntity })
  @Delete(':id')
  async deleteUserGroup(@Param('id') id: string): Promise<UserGroup> {
    const userGroup = await this.userGroupService.deleteUserGroup({
      id: Number(id),
    });
    return userGroup;
  }
}
