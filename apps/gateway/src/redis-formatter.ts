import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';

export class RedisFormatter {
  static session(sessionId: string): string {
    return `session:${sessionId}`;
  }

  static post(postId: number): string {
    return `post:${postId}`;
  }

  static postList(userId: number, take: number, page: number, status: ContentStatusEnum): string {
    return `posts:${userId}:${take}:${page}:${status}`;
  }

  static postListPattern(userId: number): string {
    return `posts:${userId}:*`;
  }

  static userCounts(userId: number): string {
    return `user_counts:${userId}`;
  }

  static comment(commentId: number): string {
    return `comment:${commentId}`;
  }

  static commentList(postId: number, take: number, page: number): string {
    return `comments:${postId}:${take}:${page}`;
  }

  static commentListPattern(postId: number): string {
    return `comments:${postId}:*`;
  }

  static postRecommendation(userId: number, page: number, take: number): string {
    return `post_recommendation:${userId}:${page}:${take}`;
  }

  static userRecommendation(userId: number, page: number, take: number): string {
    return `user_recommendation:${userId}:${page}:${take}`;
  }

  static feed(userId: number, page: number, take: number): string {
    return `feed:${userId}:${page}:${take}`;
  }

  static feedPattern(userId: number): string {
    return `feed:${userId}:*`;
  }

  static postRecommendationPattern(userId: number): string {
    return `post_recommendation:${userId}:*`;
  }

  static userRecommendationPattern(userId: number): string {
    return `user_recommendation:${userId}:*`;
  }
}
