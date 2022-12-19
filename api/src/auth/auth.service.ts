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
    console.log(user);
    const dbUser = await this.userService.user({ email: user.email });
    if (!dbUser) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
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
