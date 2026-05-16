import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { INewUser } from '@app/shared/interfaces/user/users.interface';

export class SignupRequest implements INewUser {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'User email', example: 'your@example.com' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ description: 'User password', example: '123456' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
