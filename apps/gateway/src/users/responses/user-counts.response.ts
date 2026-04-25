import { Exclude, Expose } from 'class-transformer';

import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';

@Exclude()
export class UsersCountResponse implements IFollowerFollowingCount {
  @Expose()
  followers: number;

  @Expose()
  followings: number;
}
