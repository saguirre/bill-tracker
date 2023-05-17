import { Injectable } from '@nestjs/common';
import { Prisma, Group, GroupInvite } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(
    groupWhereUniqueInput: Prisma.GroupWhereUniqueInput,
  ): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: groupWhereUniqueInput,
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        bills: true,
      },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GroupWhereUniqueInput;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
  }): Promise<Group[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.group.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        groupInvite: true,
        bills: true,
      },
    });
  }

  async create(data: Prisma.GroupCreateInput): Promise<Group> {
    return this.prisma.group.create({
      data,
    });
  }

  async createUserGroup(data: Prisma.UserGroupsCreateInput): Promise<void> {
    await this.prisma.userGroups.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.GroupWhereUniqueInput;
    data: Prisma.GroupUpdateInput;
  }): Promise<Group> {
    const { where, data } = params;
    return this.prisma.group.update({
      data,
      where,
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        bills: true,
      },
    });
  }

  async delete(where: Prisma.GroupWhereUniqueInput): Promise<Group> {
    return this.prisma.group.delete({
      where,
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        bills: true,
      },
    });
  }

  async findGroupInvites(groupId: number): Promise<GroupInvite[]> {
    return this.prisma.groupInvite.findMany({
      where: {
        id: groupId,
      },
    });
  }

  async createGroupInvite(
    data: Prisma.GroupInviteCreateInput,
  ): Promise<GroupInvite> {
    return this.prisma.groupInvite.create({
      data,
      include: {
        group: true,
      },
    });
  }

  async deleteGroupInvites(email: string, groupId: number): Promise<void> {
    await this.prisma.groupInvite.deleteMany({
      where: {
        email,
        groupId,
      },
    });
  }
}
