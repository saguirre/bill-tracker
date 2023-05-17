import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    params: Prisma.UserFindUniqueArgs,
  ): Promise<Partial<User> | null> {
    return this.prisma.user.findUnique(params);
  }

  async findMany(params: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async create(params: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(params);
  }

  async update(params: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(params);
  }

  async delete(params: Prisma.UserDeleteArgs): Promise<User> {
    return this.prisma.user.delete(params);
  }
}
