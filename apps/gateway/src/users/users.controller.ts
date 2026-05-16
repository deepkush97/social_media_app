import { Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { AppResponse } from '@app/shared/app-response.dto';
import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { UsersCountApiResponse, UsersCountResponse } from './responses/user-counts.response';

import { UsersService } from './users.service';

@ApiController('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Authenticated()
  @Post('follow/:id')
  @ApiOperation({ summary: 'use to follow another user' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'id of follower',
    example: '1',
  })
  @ApiOkResponse()
  async handleFollow(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe({ optional: false })) id: number,
  ): Promise<AppResponse<boolean>> {
    return await this.usersService.follow(user.id, id);
  }

  @Authenticated()
  @Post('unfollow/:id')
  @ApiOperation({ summary: 'use to unfollow another user' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'id of unfollower',
    example: '1',
  })
  @ApiOkResponse()
  async handleUnfollow(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe({ optional: false })) id: number,
  ): Promise<AppResponse<boolean>> {
    return await this.usersService.unfollow(user.id, id);
  }

  @Authenticated()
  @Get('counts')
  @ApiOperation({ summary: 'use to see the followers and followings of user' })
  @ApiOkResponse({
    type: UsersCountApiResponse,
  })
  async getUserCounts(@CurrentUser() user: ICurrentUser): Promise<AppResponse<UsersCountResponse>> {
    return await this.usersService.userCounts(user.id);
  }
}
