import { IPost } from '../post/post.interface';

export interface IFeedItem extends IPost {
  score: number;
}
