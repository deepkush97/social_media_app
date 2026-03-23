import { IAppResponse } from './interfaces/app-response.interface';

import { AppCodes } from './app-codes.enum';

export class AppResponse<T = unknown> implements IAppResponse<T> {
  constructor({ data, code }: AppResponse<T>) {
    this.code = code;
    this.data = data;
  }
  data?: T;
  code: AppCodes;
}
