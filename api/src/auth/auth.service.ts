import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from 'src/user/user.repository';
import { excludeUserField } from 'src/user/utils';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userRepository.findUnique({ where: { email } });
    if (user) {
      const passwordValid = await bcrypt.compare(pass, user.password);
      if (passwordValid) {
        const userWithoutPassword = excludeUserField(user, ['password']);
        return userWithoutPassword;
      }
    }
    return null;
  }

  async login(user: User) {
    const dbUser = await this.userRepository.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (dbUser && !dbUser.activated) {
      throw new HttpException('User not activated', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
    };

    const { password, ...returnedUser } = dbUser;
    const userWithToken = {
      ...returnedUser,
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };

    return userWithToken;
  }
}
