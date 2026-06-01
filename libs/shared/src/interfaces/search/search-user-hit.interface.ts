import { IScored } from './scored.interface';

export interface ISearchUserHit extends IScored {
  id: number;
  email: string;
  name?: string;
}
