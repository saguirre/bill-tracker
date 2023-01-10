import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AppLoggerMiddleware } from './logger.middleware';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BillModule } from './bill/bill.module';
import { AuthController } from './auth.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { NotificationModule } from './notification/notification.module';
import { HistoricModule } from './historic/historic.module';
import { CategoryModule } from './category/category.module';
import { GroupModule } from './group/group.module';
import { BullModule } from '@nestjs/bull';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: process.env.INVITATION_QUEUE,
    }),
    BullModule.registerQueue({
      name: process.env.ACTIVATION_QUEUE,
    }),
    HealthModule,
    AuthModule,
    UserModule,
    BillModule,
    NotificationModule,
    HistoricModule,
    CategoryModule,
    GroupModule,
  ],
  controllers: [AuthController],
  providers: [PrismaService, UserService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
