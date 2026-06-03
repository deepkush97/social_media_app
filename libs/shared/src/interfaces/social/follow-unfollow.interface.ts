import { FollowSource } from '@app/shared/enums/follow-source.enum';

export interface IFollowUnfollow {
  followerId: number;
  followingId: number;
  source?: FollowSource;
}
