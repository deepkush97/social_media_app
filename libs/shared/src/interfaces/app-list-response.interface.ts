import { IAppResponse } from './app-response.interface';
import { IPaginatedData } from './paginated-data.interface';

export type IAppListResponse<T> = IAppResponse<IPaginatedData<T>>;
