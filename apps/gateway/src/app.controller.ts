import { Controller, Get } from '@nestjs/common';

import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';

@Controller()
export class AppController {
  @Get()
  getHello(): AppResponse<string> {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }
}
