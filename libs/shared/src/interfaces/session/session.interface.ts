import { AuthSessionEnum } from '@app/shared/enums/auth-session.enum';

import { IBaseWithUserIdEntity } from '../base-entity.interface';

export interface ISession extends IBaseWithUserIdEntity {
  status: AuthSessionEnum;
  guid: string;
}
