import { AuthSessionEnum } from '@app/shared/enums/auth-session.enum';

import { IBaseEntity } from '../base-entity.interface';

export interface ISession extends IBaseEntity {
  status: AuthSessionEnum;
  guid: string;
}
