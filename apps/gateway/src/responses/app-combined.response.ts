import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';

export function ApiResponse<T = void>(data: Type<T>): Type<IAppResponse<T>> {
  abstract class ApiResponse {
    @ApiProperty({ enum: AppCodes, description: 'App code' })
    code: AppCodes;

    @ApiProperty({ type: data, description: 'Result' })
    data: T;
  }

  return ApiResponse as Type<IAppResponse<T>>;
}
