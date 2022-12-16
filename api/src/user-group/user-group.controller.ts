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
import { UserGroup, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserGroupService } from './user-group.service';

@Controller('user-group')
export class UserGroupController {
  constructor(private userGroupService: UserGroupService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserGroupById(@Param('id') id: string): Promise<Partial<UserGroup>> {
    const userGroup = await this.userGroupService.userGroup({ id: Number(id) });
    return userGroup;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserGroups(): Promise<UserGroup[]> {
    const userGroups = await this.userGroupService.userGroups({});
    return userGroups;
  }

  @UseGuards(JwtAuthGuard)
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
  @Get('/group/:id')
  async getUserGroupsByGroupId(@Param('id') id: string): Promise<UserGroup[]> {
    const userGroups = await this.userGroupService.userGroups({
      where: { id: Number(id) },
    });
    return userGroups;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserGroup(
    @Body() createUserGroupInput: Prisma.UserGroupCreateInput,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupService.createUserGroup(
      createUserGroupInput,
    );
    return userGroup;
  }

  @UseGuards(JwtAuthGuard)
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
  @Delete(':id')
  async deleteUserGroup(@Param('id') id: string): Promise<UserGroup> {
    const userGroup = await this.userGroupService.deleteUserGroup({
      id: Number(id),
    });
    return userGroup;
  }
}
