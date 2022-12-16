import { Injectable } from '@nestjs/common';
import { Prisma, UserGroup } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserGroupService {
  constructor(private prismaService: PrismaService) {}

  async userGroup(
    userGroupWhereUniqueInput: Prisma.UserGroupWhereUniqueInput,
  ): Promise<Partial<UserGroup> | null> {
    const userGroup = await this.prismaService.userGroup.findUnique({
      where: userGroupWhereUniqueInput,
    });

    return userGroup;
  }

  async userGroups(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserGroupWhereUniqueInput;
    where?: Prisma.UserGroupWhereInput;
    orderBy?: Prisma.UserGroupOrderByWithRelationInput;
  }): Promise<UserGroup[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.userGroup.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUserGroup(data: Prisma.UserGroupCreateInput): Promise<UserGroup> {
    return this.prismaService.userGroup.create({
      data,
    });
  }

  async addUserToGroup(params: {
    userId: number;
    groupId: number;
  }): Promise<UserGroup> {
    const { userId, groupId } = params;
    return this.prismaService.userGroup.update({
      where: { id: groupId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  }

  async removeUserFromGroup(params: {
    userId: number;
    groupId: number;
  }): Promise<UserGroup> {
    const { userId, groupId } = params;
    return this.prismaService.userGroup.update({
      where: { id: groupId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async updateUserGroup(params: {
    where: Prisma.UserGroupWhereUniqueInput;
    data: Prisma.UserGroupUpdateInput;
  }): Promise<UserGroup> {
    const { where, data } = params;
    return this.prismaService.userGroup.update({
      data,
      where,
    });
  }

  async deleteUserGroup(
    where: Prisma.UserGroupWhereUniqueInput,
  ): Promise<UserGroup> {
    return this.prismaService.userGroup.delete({
      where,
    });
  }
}
