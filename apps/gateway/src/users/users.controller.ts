import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { AppResponse } from '@app/shared/app-response.dto';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { UsersCountResponse } from './responses/user-counts.response';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Authenticated()
  @Post('follow/:id')
  async handleFollow(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe({ optional: false })) id: number,
  ): Promise<AppResponse<boolean>> {
    return await this.usersService.follow(user.id, id);
  }

  @Authenticated()
  @Post('unfollow/:id')
  async handleUnfollow(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe({ optional: false })) id: number,
  ): Promise<AppResponse<boolean>> {
    return await this.usersService.unfollow(user.id, id);
  }

  @Authenticated()
  @Get('counts')
  async getUserCounts(@CurrentUser() user: ICurrentUser): Promise<AppResponse<UsersCountResponse>> {
    return await this.usersService.userCounts(user.id);
  }
}
