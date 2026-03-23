import { AppCodes } from '../app-codes.enum';

export interface IAppResponse<T> {
  data?: T;
  code: AppCodes;
}
