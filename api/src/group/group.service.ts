import { Injectable } from '@nestjs/common';
import { Group, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async group(
    groupWhereUniqueInput: Prisma.GroupWhereUniqueInput,
  ): Promise<Partial<Group> | null> {
    const group = await this.prisma.group.findUnique({
      where: groupWhereUniqueInput,
      include: {
        members: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        bills: true,
      },
    });

    return group;
  }

  async groups(params: {
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
            id: true,
            email: true,
            name: true,
          },
        },
        bills: true,
      },
    });
  }

  async createGroup(data: Prisma.GroupCreateInput): Promise<Group> {
    return this.prisma.group.create({
      data,
      include: {
        members: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        bills: true,
      },
    });
  }

  async updateGroup(params: {
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
            id: true,
            email: true,
            name: true,
          },
        },
        bills: true,
      },
    });
  }

  async deleteGroup(where: Prisma.GroupWhereUniqueInput): Promise<Group> {
    return this.prisma.group.delete({
      where,
      include: {
        members: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        bills: true,
      },
    });
  }
}
