import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsSameUserGuard } from 'src/auth/is-same-user.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
  @Put('/settings/:id')
  async updateUserById(
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
