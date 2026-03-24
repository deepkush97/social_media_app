import { Injectable } from '@nestjs/common';

import {
  BooleanOutputDto,
  BooleanOutputDtoGenqlSelection,
  CreateUserInput,
  LoginUserInput,
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
}
