import { IScored } from './scored.interface';

export interface ISearchUserHitOutput extends IScored {
  id: number;
  email: string;
  name?: string;
}
