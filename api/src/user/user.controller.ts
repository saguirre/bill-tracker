import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsSameUserGuard } from 'src/auth/is-same-user.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserProfileEntity } from './entities/update-user-profile-entity';
import { UpdateUserSettingsEntity } from './entities/update-user-settings.entity';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<Partial<User>> {
    const user = await this.userService.user({ id: Number(id) });
    delete user.password;
    return user;
  }

  @UseGuards(JwtAuthGuard, IsSameUserGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Put('/profile/:id')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() user: UpdateUserProfileEntity,
  ): Promise<Partial<User>> {
    const updatedUser = await this.userService.updateUser({
      where: { id: Number(id) },
      data: user,
    });
    delete updatedUser.password;
    return updatedUser;
  }

  @ApiOkResponse()
  @Put('/activate/:id')
  async activateUser(@Param('id') id: string, @Body() body: { token: string }) {
    const { password, ...activatedUser } = await this.userService.activateUser({
      where: { id: Number(id) },
      data: { activationToken: body.token },
    });

    return activatedUser;
  }

  @ApiOkResponse()
  @Post('/forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const { password, passwordRecoveryToken, activationToken, ...user } =
      await this.userService.forgotPassword(body.email);
    return user;
  }

  @ApiOkResponse()
  @Post('/reset-password')
  async recoverPassword(@Body() body: { password: string; token: string }) {
    const { password, passwordRecoveryToken, activationToken, ...user } =
      await this.userService.recoverPassword(body.password, body.token);
    return user;
  }

  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Put('/:id/change-password')
  async changePassword(
    @Param('id') id: number,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { password, passwordRecoveryToken, activationToken, ...user } =
      await this.userService.changePassword(
        id,
        body.oldPassword,
        body.newPassword,
      );
    return user;
  }

  @UseGuards(JwtAuthGuard, IsSameUserGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Put('/settings/:id')
  async updateUserSettings(
    @Param('id') id: string,
    @Body() user: UpdateUserSettingsEntity,
  ): Promise<Partial<User>> {
    const updatedUser = await this.userService.updateUser({
      where: { id: Number(id) },
      data: user,
    });
    delete updatedUser.password;
    return updatedUser;
  }
}
