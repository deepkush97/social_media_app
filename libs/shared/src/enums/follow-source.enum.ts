import { registerEnumType } from '@nestjs/graphql';

export enum FollowSource {
  search = 'search',
  suggested = 'suggested',
  profile = 'profile',
  feed = 'feed',
}

registerEnumType(FollowSource, { name: 'FollowSource' });
