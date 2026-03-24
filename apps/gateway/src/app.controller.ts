import { Controller, Get } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';

@Controller()
export class AppController {
  @Get()
  getHello(): AppResponse<string> {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }
}
