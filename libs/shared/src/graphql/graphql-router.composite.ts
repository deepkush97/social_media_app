import { Injectable } from '@nestjs/common';

import {
  BooleanOutputDto,
  BooleanOutputDtoGenqlSelection,
  CommentListOutputDto,
  CommentListOutputDtoGenqlSelection,
  CommentOutputDto,
  CommentOutputDtoGenqlSelection,
  CommentsPaginationInput,
  CreateCommentInput,
  CreatePostInput,
  CreateUserInput,
  FollowUnfollowInput,
  LikeInput,
  LikeOutputDto,
  LikeOutputDtoGenqlSelection,
  LoginUserInput,
  NumberOutputDto,
  NumberOutputDtoGenqlSelection,
  PostListOutputDto,
  PostListOutputDtoGenqlSelection,
  PostOutputDto,
  PostOutputDtoGenqlSelection,
  PostRecommendationInput,
  PostRecommendationOutputDto,
  PostRecommendationOutputDtoGenqlSelection,
  PostsPaginationInput,
  SearchInput,
  SearchPostOutputDto,
  SearchPostOutputDtoGenqlSelection,
  SearchTagOutputDto,
  SearchTagOutputDtoGenqlSelection,
  SearchUserOutputDto,
  SearchUserOutputDtoGenqlSelection,
  SessionOutputDto,
  SessionOutputDtoGenqlSelection,
  UserCountsDto,
  UserCountsDtoGenqlSelection,
  UserOutputDto,
  UserOutputDtoGenqlSelection,
  UserRecommendationInput,
  UserRecommendationOutputDto,
  UserRecommendationOutputDtoGenqlSelection,
} from './client';
import { GraphqlRouterService } from './graphql-router.service';

@Injectable()
export class GraphqlRouterComposite {
  constructor(private readonly routerService: GraphqlRouterService) {}

  public async createUser(
    input: CreateUserInput,
    projection: UserOutputDtoGenqlSelection,
  ): Promise<UserOutputDto> {
    const result = await this.routerService.client.mutation({
      createUser: {
        __args: { input },
        ...projection,
      },
    });
    return result.createUser;
  }

  public async createNewSession(
    id: number,
    projection: SessionOutputDtoGenqlSelection,
  ): Promise<SessionOutputDto> {
    const result = await this.routerService.client.mutation({
      createSession: {
        __args: { id },
        ...projection,
      },
    });
    return result.createSession;
  }

  public async loginUser(
    input: LoginUserInput,
    projection: UserOutputDtoGenqlSelection,
  ): Promise<UserOutputDto> {
    const result = await this.routerService.client.mutation({
      loginUser: {
        __args: { input },
        ...projection,
      },
    });
    return result.loginUser;
  }

  public async closeAllOpenSessionByUserId(
    id: number,
    projection: BooleanOutputDtoGenqlSelection,
  ): Promise<BooleanOutputDto> {
    const result = await this.routerService.client.mutation({
      closeAllOpenSessionByUserId: {
        __args: { id },
        ...projection,
      },
    });

    return result.closeAllOpenSessionByUserId;
  }

  public async closeSessionBySessionId(
    guid: string,
    projection: BooleanOutputDtoGenqlSelection,
  ): Promise<BooleanOutputDto> {
    const result = await this.routerService.client.mutation({
      closeSessionBySessionId: {
        __args: { guid },
        ...projection,
      },
    });

    return result.closeSessionBySessionId;
  }

  public async findOpenSessionByGuid(
    id: string,
    projection: SessionOutputDtoGenqlSelection,
  ): Promise<SessionOutputDto> {
    const result = await this.routerService.client.query({
      findOpenSessionByGuid: {
        __args: { id },
        ...projection,
      },
    });

    return result.findOpenSessionByGuid;
  }

  public async findUserById(
    id: number,
    projection: UserOutputDtoGenqlSelection,
  ): Promise<UserOutputDto> {
    const result = await this.routerService.client.query({
      findUserById: {
        __args: { id },
        ...projection,
      },
    });

    return result.findUserById;
  }

  public async createPost(
    input: CreatePostInput,
    projection: PostOutputDtoGenqlSelection,
  ): Promise<PostOutputDto> {
    const result = await this.routerService.client.mutation({
      createPost: {
        __args: { input },
        ...projection,
      },
    });
    return result.createPost;
  }

  public async findPostById(
    id: number,
    projection: PostOutputDtoGenqlSelection,
  ): Promise<PostOutputDto> {
    const result = await this.routerService.client.query({
      findPostById: {
        __args: { id },
        ...projection,
      },
    });

    return result.findPostById;
  }

  public async findPostsByUserId(
    input: PostsPaginationInput,
    projection: PostListOutputDtoGenqlSelection,
  ): Promise<PostListOutputDto> {
    const result = await this.routerService.client.query({
      findPostsByUserId: {
        __args: { input },
        ...projection,
      },
    });

    return result.findPostsByUserId;
  }

  public async archivePost(
    id: number,
    projection: BooleanOutputDtoGenqlSelection,
  ): Promise<BooleanOutputDto> {
    const result = await this.routerService.client.mutation({
      archivePost: {
        __args: { id },
        ...projection,
      },
    });

    return result.archivePost;
  }

  public async followUser(
    input: FollowUnfollowInput,
    projection: UserCountsDtoGenqlSelection,
  ): Promise<UserCountsDto> {
    const result = await this.routerService.client.mutation({
      follow: {
        __args: { input },
        ...projection,
      },
    });

    return result.follow;
  }

  public async unfollowUser(
    input: FollowUnfollowInput,
    projection: UserCountsDtoGenqlSelection,
  ): Promise<UserCountsDto> {
    const result = await this.routerService.client.mutation({
      unfollow: {
        __args: { input },
        ...projection,
      },
    });

    return result.unfollow;
  }

  public async userCounts(
    id: number,
    projection: UserCountsDtoGenqlSelection,
  ): Promise<UserCountsDto> {
    const result = await this.routerService.client.query({
      userCounts: {
        __args: { id },
        ...projection,
      },
    });

    return result.userCounts;
  }

  public async likePost(
    input: LikeInput,
    projection: LikeOutputDtoGenqlSelection,
  ): Promise<LikeOutputDto> {
    const result = await this.routerService.client.mutation({
      likePost: {
        __args: { input },
        ...projection,
      },
    });

    return result.likePost;
  }

  public async unlikePost(
    input: LikeInput,
    projection: BooleanOutputDtoGenqlSelection,
  ): Promise<BooleanOutputDto> {
    const result = await this.routerService.client.mutation({
      unlikePost: {
        __args: { input },
        ...projection,
      },
    });

    return result.unlikePost;
  }

  public async postLikeCount(
    postId: number,
    projection: NumberOutputDtoGenqlSelection,
  ): Promise<NumberOutputDto> {
    const result = await this.routerService.client.query({
      postLikeCount: {
        __args: { postId },
        ...projection,
      },
    });

    return result.postLikeCount;
  }

  public async hasUserLikedPost(
    userId: number,
    postId: number,
    projection: BooleanOutputDtoGenqlSelection,
  ): Promise<BooleanOutputDto> {
    const result = await this.routerService.client.query({
      hasUserLikedPost: {
        __args: { userId, postId },
        ...projection,
      },
    });

    return result.hasUserLikedPost;
  }

  public async searchPosts(
    input: SearchInput,
    projection: SearchPostOutputDtoGenqlSelection,
  ): Promise<SearchPostOutputDto> {
    const result = await this.routerService.client.query({
      searchPosts: {
        __args: { input },
        ...projection,
      },
    });

    return result.searchPosts;
  }

  public async searchUsers(
    input: SearchInput,
    projection: SearchUserOutputDtoGenqlSelection,
  ): Promise<SearchUserOutputDto> {
    const result = await this.routerService.client.query({
      searchUsers: {
        __args: { input },
        ...projection,
      },
    });

    return result.searchUsers;
  }

  public async searchTags(
    input: SearchInput,
    projection: SearchTagOutputDtoGenqlSelection,
  ): Promise<SearchTagOutputDto> {
    const result = await this.routerService.client.query({
      searchTags: {
        __args: { input },
        ...projection,
      },
    });

    return result.searchTags;
  }

  public async createComment(
    input: CreateCommentInput,
    projection: CommentOutputDtoGenqlSelection,
  ): Promise<CommentOutputDto> {
    const result = await this.routerService.client.mutation({
      createComment: {
        __args: { input },
        ...projection,
      },
    });
    return result.createComment as CommentOutputDto;
  }

  public async findCommentById(
    id: number,
    projection: CommentOutputDtoGenqlSelection,
  ): Promise<CommentOutputDto> {
    const result = await this.routerService.client.query({
      findCommentById: {
        __args: { id },
        ...projection,
      },
    });
    return result.findCommentById as CommentOutputDto;
  }

  public async findCommentsByPostId(
    input: CommentsPaginationInput,
    projection: CommentListOutputDtoGenqlSelection,
  ): Promise<CommentListOutputDto> {
    const result = await this.routerService.client.query({
      findCommentsByPostId: {
        __args: { input },
        ...projection,
      },
    });
    return result.findCommentsByPostId as CommentListOutputDto;
  }

  public async archiveComment(
    id: number,
    projection: BooleanOutputDtoGenqlSelection,
  ): Promise<BooleanOutputDto> {
    const result = await this.routerService.client.mutation({
      archiveComment: {
        __args: { id },
        ...projection,
      },
    });
    return result.archiveComment as BooleanOutputDto;
  }

  public async postRecommendation(
    input: PostRecommendationInput,
    projection: PostRecommendationOutputDtoGenqlSelection,
  ): Promise<PostRecommendationOutputDto> {
    const result = await this.routerService.client.query({
      postRecommendation: {
        __args: { input },
        ...projection,
      },
    });

    return result.postRecommendation;
  }

  public async userRecommendation(
    input: UserRecommendationInput,
    projection: UserRecommendationOutputDtoGenqlSelection,
  ): Promise<UserRecommendationOutputDto> {
    const result = await this.routerService.client.query({
      userRecommendation: {
        __args: { input },
        ...projection,
      },
    });

    return result.userRecommendation;
  }
}
