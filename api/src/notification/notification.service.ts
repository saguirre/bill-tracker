import { Injectable } from '@nestjs/common';
import { Prisma, Notification } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async notification(
    notificationWhereUniqueInput: Prisma.NotificationWhereUniqueInput,
  ): Promise<Partial<Notification> | null> {
    const notification = await this.prisma.notification.findUnique({
      where: notificationWhereUniqueInput,
    });

    return notification;
  }

  async notifications(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.NotificationWhereUniqueInput;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
  }): Promise<Notification[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.notification.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createNotification(
    data: Prisma.NotificationCreateInput,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data,
    });
  }

  async updateNotification(params: {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.NotificationUpdateInput;
  }): Promise<Notification> {
    const { where, data } = params;
    return this.prisma.notification.update({
      data,
      where,
    });
  }

  async deleteNotification(
    where: Prisma.NotificationWhereUniqueInput,
  ): Promise<Notification> {
    return this.prisma.notification.delete({
      where,
    });
  }
}
