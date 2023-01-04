import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Group, GroupInvite, Prisma } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GroupService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(process.env.INVITATION_QUEUE as string)
    private readonly invitationQueue: Queue,
  ) {}

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
        groupInvite: true,
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

  async createGroupInvitations(params: {
    groupId: number;
    emails: { email: string }[];
  }): Promise<Group> {
    const { groupId, emails } = params;
    const group = await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        groupInvite: {
          create: emails.map((obj) => ({
            email: obj.email,
          })),
        },
      },
    });

    return group;
  }

  async getPendingInvites(params: { groupId: number }): Promise<GroupInvite[]> {
    const { groupId } = params;
    const groupInvites = await this.prisma.groupInvite.findMany({
      where: {
        id: groupId,
      },
    });

    return groupInvites;
  }

  async generateGroupInviteLink(params: {
    groupId: number;
    email: string;
  }): Promise<string> {
    const { groupId, email } = params;
    const groupInvite = await this.prisma.groupInvite.create({
      data: {
        email,
        group: {
          connect: {
            id: groupId,
          },
        },
      },
      include: {
        group: true,
      },
    });

    return `${process.env.CLIENT_URL}/group/${groupInvite.group.id}/invite/${groupInvite.id}`;
  }

  async acceptGroupInvite(params: {
    groupId: number;
    email: string;
  }): Promise<Group> {
    const { groupId, email } = params;
    const group = await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: {
            email,
          },
        },
      },
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

    await this.prisma.groupInvite.deleteMany({
      where: {
        email,
        groupId,
      },
    });

    return group;
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
