import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @InjectQueue(process.env.ACTIVATION_QUEUE as string)
    private readonly activationQueue: Queue,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    return user;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(data.password, salt);
    data.password = password;

    const newUser = await this.prisma.user.create({
      data,
    });

    const activationToken = this.jwtService.sign({ userId: newUser.id });

    await this.prisma.user.update({
      where: {
        id: Number(newUser.id),
      },
      data: {
        activationToken,
      },
    });

    const url = `${process.env.CLIENT_URL}/activate-account?token=${activationToken}`;

    const jobData = {
      context: {
        url,
        name: data.name,
      },
      email: data.email,
    };

    Logger.debug('Adding activation job to queue');
    this.activationQueue.add(process.env.ACTIVATION_JOB, jobData, {
      delay: 1000,
    });

    return newUser;
  }

  async activateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    const user = await this.prisma.user.findUnique({
      where,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { activationToken, activated } = user;
    if (!activationToken || activated) {
      throw new ConflictException('User already activated');
    }

    if (activationToken !== data.activationToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.prisma.user.update({
      where,
      data: {
        activated: true,
        activationToken: null,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async inactivateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
