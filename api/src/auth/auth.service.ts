import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { excludeUserField } from 'src/user/utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.user({ email });
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
    const dbUser = await this.userService.user({ id: Number(user.id) });
    if (!dbUser) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const userWithToken = {
      ...user,
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };

    return userWithToken;
  }
}
