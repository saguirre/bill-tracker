import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, PrismaService],
})
export class CategoryModule {}
