import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    params: Prisma.CategoryFindUniqueArgs,
  ): Promise<Partial<Category> | null> {
    return this.prisma.category.findUnique(params);
  }

  async findMany(params: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return this.prisma.category.findMany(params);
  }

  async create(params: Prisma.CategoryCreateArgs): Promise<Category> {
    return this.prisma.category.create(params);
  }

  async update(params: Prisma.CategoryUpdateArgs): Promise<Category> {
    return this.prisma.category.update(params);
  }

  async delete(params: Prisma.CategoryDeleteArgs): Promise<Category> {
    return this.prisma.category.delete(params);
  }
}
