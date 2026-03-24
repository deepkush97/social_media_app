import { Injectable } from '@nestjs/common';

import {
  CreateUserInput,
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
}
