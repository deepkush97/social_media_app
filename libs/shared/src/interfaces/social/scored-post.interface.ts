import { IPost } from '../post/post.interface';

export interface IScoredPost extends IPost {
  score: number;
}
