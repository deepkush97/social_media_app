import { IBaseEntity } from '../base-entity.interface';

export interface INewUrl {
  url: string;
  description?: string;
}

export type IUrl = INewUrl & IBaseEntity & { code: string };
