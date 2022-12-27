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
import { Category } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryEntity } from './entities/create-category.entity';
import { UpdateCategoryEntity } from './entities/update-category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CategoryEntity })
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<Partial<Category>> {
    const category = await this.categoryService.category({ id: Number(id) });
    return category;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  @Get()
  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryService.categories({});
    return categories;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  @Get('/user/:id')
  async getCategoriesByUserId(@Param('id') id: string): Promise<Category[]> {
    const categories = await this.categoryService.categories({
      where: { userId: Number(id) },
    });
    return categories;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: CategoryEntity })
  @Post('user/:id')
  async createCategory(
    @Param('id') id: string,
    @Body() category: CreateCategoryEntity,
  ): Promise<Category> {
    const createdCategory = await this.categoryService.createCategory({
      ...category,
      user: { connect: { id: Number(id) } },
    });
    return createdCategory;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CategoryEntity })
  @Put('/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryEntity,
  ): Promise<Category> {
    const updatedCategory = await this.categoryService.updateCategory({
      where: { id: Number(id) },
      data: category,
    });
    return updatedCategory;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CategoryEntity })
  @Delete('/:id')
  async deleteCategory(@Param('id') id: string): Promise<Category> {
    const deletedCategory = await this.categoryService.deleteCategory({
      id: Number(id),
    });
    return deletedCategory;
  }
}
