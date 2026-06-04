export enum NatsEvents {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  POST_CREATED = 'post.created',
  POST_UPDATED = 'post.updated',
  POST_LIKED = 'post.liked',
  POST_UNLIKED = 'post.unliked',
  USER_FOLLOWED = 'user.followed',
  USER_UNFOLLOWED = 'user.unfollowed',
  IMPRESSION_CREATED = 'impression.created',
  SEARCH_INDEX_REQUESTED = 'search.index.requested',
  SEARCH_INDEX_RETRY = 'search.index.retry',
}
