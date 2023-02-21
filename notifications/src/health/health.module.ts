import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from 'src/prisma.service';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma-health.indicator';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, PrismaService],
})
export class HealthModule {}
