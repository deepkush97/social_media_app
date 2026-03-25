import { Injectable } from '@nestjs/common';

import {
  BooleanOutputDto,
  BooleanOutputDtoGenqlSelection,
  CreatePostInput,
  CreateUserInput,
  LoginUserInput,
  PostListOutputDto,
  PostListOutputDtoGenqlSelection,
  PostOutputDto,
  PostOutputDtoGenqlSelection,
  PostsPaginationInput,
  SessionOutputDto,
  SessionOutputDtoGenqlSelection,
  UserOutputDto,
  UserOutputDtoGenqlSelection,
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
}
