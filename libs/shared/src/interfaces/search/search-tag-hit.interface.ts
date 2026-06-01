import { IScored } from './scored.interface';

export interface ISearchTagHit extends IScored {
  id: string;
  name: string;
}
