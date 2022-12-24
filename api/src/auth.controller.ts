import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserService } from './user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() body) {
    const user = await this.authService.login(body);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async verify(@Request() req) {
    return true;
  }

  @Post('/signup')
  async signUp(@Body() body: Prisma.UserCreateInput) {
    const createdUser = await this.userService.createUser(body);
    const user = await this.login({
      email: createdUser.email,
      password: body.password,
    });
    return user;
  }
}
