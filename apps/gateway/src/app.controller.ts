import { Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AppResponse } from '@app/shared/app-response.dto';
import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import { AppCodes } from '@app/shared/enums/app-codes.enum';

@ApiController('app')
export class AppController {
  @Get()
  @ApiOkResponse({ description: 'just a default endpoint' })
  getHello(): AppResponse<string> {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }
}
