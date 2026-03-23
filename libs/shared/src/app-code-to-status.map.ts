import { HttpStatus } from '@nestjs/common';

import { AppCodes } from './app-codes.enum';

export const appCodeToStatusMap: Record<AppCodes, number> = {
  OPERATION_SUCCESS: HttpStatus.OK,
  INVALID_CREDENTIALS: HttpStatus.BAD_REQUEST,
  INVALID_EMAIL: HttpStatus.BAD_REQUEST,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  USER_CREATED: HttpStatus.CREATED,
  BAD_REQUEST: HttpStatus.BAD_REQUEST,
  URL_CREATED: HttpStatus.CREATED,
  URL_NOT_FOUND: HttpStatus.NOT_FOUND,
};
