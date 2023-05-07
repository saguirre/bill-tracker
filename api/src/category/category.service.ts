import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async category(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Partial<Category> | null> {
    return this.repository.findUnique({
      where: categoryWhereUniqueInput,
    });
  }

  async categories(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<Category[]> {
    return this.repository.findMany(params);
  }

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.repository.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category> {
    return this.repository.update(params);
  }

  async deleteCategory(
    where: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    return this.repository.delete({ where });
  }
}
