import { PostStatusEnum } from '@app/shared/enums/post-status.enum';

export class RedisFormatter {
  static session(sessionId: string): string {
    return `session:${sessionId}`;
  }

  static post(postId: number): string {
    return `post:${postId}`;
  }

  static postList(userId: number, take: number, page: number, status: PostStatusEnum): string {
    return `posts:${userId}:${take}:${page}:${status}`;
  }

  static postListPattern(userId: number): string {
    return `posts:${userId}:*`;
  }

  static userCounts(userId: number): string {
    return `user_counts:${userId}`;
  }

  static postRecommendation(userId: number, page: number, take: number): string {
    return `post_recommendation:${userId}:${page}:${take}`;
  }

  static userRecommendation(userId: number, page: number, take: number): string {
    return `user_recommendation:${userId}:${page}:${take}`;
  }

  static postRecommendationPattern(userId: number): string {
    return `post_recommendation:${userId}:*`;
  }

  static userRecommendationPattern(userId: number): string {
    return `user_recommendation:${userId}:*`;
  }
}
