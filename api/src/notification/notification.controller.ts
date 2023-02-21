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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateNotificationEntity } from './entities/create-notification.entity';
import { NotificationEntity } from './entities/notification.entity';
import { UpdateNotificationEntity } from './entities/update-notification.entity';
import { NotificationService } from './notification.service';
import { Notification } from '@prisma/client';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: NotificationEntity, isArray: true })
  @Get('/user/:id')
  async getNotificationsByUserId(
    @Param('id') id: string,
  ): Promise<Notification[]> {
    const notifications = await this.notificationService.notifications({
      where: { userId: Number(id) },
    });
    return notifications;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: NotificationEntity, isArray: true })
  @Get('/group/:id')
  async getNotificationsByGroupId(
    @Param('id') id: string,
  ): Promise<Notification[]> {
    const notifications = await this.notificationService.notifications({
      where: { groupId: Number(id) },
    });
    return notifications;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: NotificationEntity })
  @Post('user/:id')
  async createNotification(
    @Param('id') id: string,
    @Body() notification: CreateNotificationEntity,
  ): Promise<Notification> {
    const createdNotification =
      await this.notificationService.createNotification({
        ...notification,
        user: { connect: { id: Number(id) } },
      });
    return createdNotification;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: NotificationEntity })
  @Post('/group/:groupId/user/:id')
  async createNotificationByGroupId(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Body() notification: CreateNotificationEntity,
  ): Promise<Notification> {
    const createdNotification =
      await this.notificationService.createNotification({
        ...notification,
        user: { connect: { id: Number(id) } },
        group: { connect: { id: Number(groupId) } },
      });
    return createdNotification;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: NotificationEntity })
  @Put('/:id')
  async updateBill(
    @Param('id') id: string,
    @Body() notification: UpdateNotificationEntity,
  ): Promise<Notification> {
    const updatedNotification =
      await this.notificationService.updateNotification({
        where: { id: Number(id) },
        data: notification,
      });
    return updatedNotification;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: NotificationEntity })
  @Delete('/:id')
  async deleteNotification(@Param('id') id: string): Promise<Notification> {
    const deletedNotification =
      await this.notificationService.deleteNotification({
        id: Number(id),
      });
    return deletedNotification;
  }
}
