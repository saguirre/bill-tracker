import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { EmailProcessingModule } from './email-processing/email-processing.module';
import { AppLoggerMiddleware } from './logger.middleware';
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
    BullModule.registerQueue({
      name: process.env.FORGOT_PASSWORD_QUEUE,
    }),
    EmailModule,
    EmailProcessingModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
