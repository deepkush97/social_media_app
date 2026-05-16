import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IAuthProfile, IAuthProfileToken } from '@app/shared/interfaces/auth/auth-user.interface';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { ApiResponse } from '../../responses/app-combined.response';

@Exclude()
export class AuthUser implements ICurrentUser {
  @Expose()
  @ApiProperty({ description: 'User id', example: '1' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'User email', example: 'your@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ description: 'User session', example: '683BA860-E1A6-4AA0-A3C0-DAF3B6A3C51D' })
  sessionId: string;

  @Expose()
  @ApiProperty({ description: 'User account creation date', example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;
}

@Exclude()
export class AuthProfile implements IAuthProfile {
  @Expose()
  @ApiProperty({ description: 'User profile', type: AuthUser })
  profile: AuthUser;
}

export class AuthProfileApiResponse extends ApiResponse(AuthProfile) {}

@Exclude()
export class AuthProfileToken extends AuthProfile implements IAuthProfileToken {
  @Expose()
  @ApiProperty({ description: 'User jwt token', example: '...some token' })
  jwtToken: string;
}

export class AuthProfileTokenApiResponse extends ApiResponse(AuthProfileToken) {}
