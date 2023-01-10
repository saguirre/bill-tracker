import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Group, GroupInvite, Prisma } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma.service';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
dotenv.config();

@Injectable()
export class GroupService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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

  async createGroup(data: Prisma.GroupCreateInput): Promise<Group> {
    const createdGroup = await this.prisma.group.create({
      data,
    });

    await this.prisma.userGroups.create({
      data: {
        userId: data.admin.connect.id,
        groupId: createdGroup.id,
      },
    });

    const updatedGroup = await this.prisma.group.update({
      where: {
        id: createdGroup.id,
      },
      data: {
        members: {
          connect: {
            groupId_userId: {
              groupId: createdGroup.id,
              userId: data.admin.connect.id,
            },
          },
        },
      },
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
      },
    });
    return updatedGroup;
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
      include: {
        admin: {
          select: {
            name: true,
          },
        },
      },
    });

    emails.forEach((obj) => {
      const token = this.jwtService.sign({ groupId, email: obj.email });
      const url = `${process.env.CLIENT_URL}/group/join?token=${token}`;

      Logger.log('Adding invitation to queue');
      this.invitationQueue.add(
        process.env.INVITATION_JOB,
        {
          context: {
            url,
            groupName: group.name,
            adminName: group.admin.name,
          },
          email: obj.email,
        },
        {
          delay: 1000,
        },
      );
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
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.userGroups.create({
      data: {
        userId: user.id,
        groupId,
      },
    });

    const group = await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: {
            groupId_userId: {
              groupId,
              userId: user.id,
            },
          },
        },
      },
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

  async deleteGroup(where: Prisma.GroupWhereUniqueInput): Promise<Group> {
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
}
