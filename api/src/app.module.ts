import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AppLoggerMiddleware } from './logger.middleware';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BillModule } from './bill/bill.module';
import { UserGroupModule } from './user-group/user-group.module';
import { AuthController } from './auth.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { NotificationModule } from './notification/notification.module';
import { HistoricModule } from './historic/historic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    AuthModule,
    UserModule,
    BillModule,
    UserGroupModule,
    NotificationModule,
    HistoricModule,
  ],
  controllers: [AuthController],
  providers: [PrismaService, UserService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
