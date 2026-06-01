import { IScored } from './scored.interface';

export interface ISearchPostHit extends IScored {
  id: number;
  title: string;
  content?: string;
  tags?: string[];
  userId: number;
}
