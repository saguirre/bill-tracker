import {
  ConflictException,
  HttpException,
  HttpStatus,
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
import { UserRepository } from './user.repository';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private jwtService: JwtService,
    @InjectQueue(process.env.ACTIVATION_QUEUE as string)
    private readonly activationQueue: Queue,
    @InjectQueue(process.env.FORGOT_PASSWORD_QUEUE as string)
    private readonly forgotPasswordQueue: Queue,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Partial<User> | null> {
    return this.repository.findUnique({ where: userWhereUniqueInput });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.repository.findMany(params);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(data.password, salt);
    data.password = password;

    const newUser = await this.repository.create({
      data,
    });

    const activationToken = this.jwtService.sign(
      { userId: newUser.id },
      { secret: process.env.JWT_SECRET },
    );

    await this.repository.update({
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
    const user = await this.repository.findUnique({
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

    return this.repository.update({
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
    return this.repository.update(params);
  }

  async forgotPassword(email: string) {
    const user = await this.repository.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordRecoveryToken = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_SECRET },
    );
    const updatedUser = await this.repository.update({
      where: { id: Number(user.id) },
      data: {
        passwordRecoveryToken,
      },
    });

    const url = `${process.env.CLIENT_URL}/reset-password?token=${passwordRecoveryToken}`;
    Logger.debug('Adding forgot password job to queue');
    this.forgotPasswordQueue.add(process.env.FORGOT_PASSWORD_JOB, {
      context: {
        name: user.name,
        url,
      },
      email,
    });
    return updatedUser;
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.repository.findUnique({
      where: { id: Number(userId) },
    });
    const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
    if (!passwordIsValid) {
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    const updatedUser = await this.repository.update({
      where: { id: Number(userId) },
      data: {
        password: newPasswordHash,
      },
    });

    return updatedUser;
  }

  async recoverPassword(password: string, token: string) {
    const decodedToken = this.jwtService.decode(token);

    if (!decodedToken || !decodedToken['userId']) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId = decodedToken['userId'];
    const user = await this.repository.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.passwordRecoveryToken !== token) {
      throw new UnauthorizedException('Invalid token');
    }

    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(password, salt);
    const updatedUser = await this.repository.update({
      where: { id: Number(user.id) },
      data: {
        password: newPassword,
        passwordRecoveryToken: null,
      },
    });

    return updatedUser;
  }

  async inactivateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.repository.update({
      where,
      data,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.repository.delete({ where });
  }
}
