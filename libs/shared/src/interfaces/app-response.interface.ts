import { AppCodes } from '../enums/app-codes.enum';

export interface IAppResponse<T> {
  data?: T;
  code: AppCodes;
}
