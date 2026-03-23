import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateUserInput } from './inputs/create-user.input';
import { SessionOutputDto } from './outputs/session.output';
import { UserOutputDto } from './outputs/user.output';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserOutputDto)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserOutputDto> {
    return this.authService.createUser(input);
  }

  @Mutation(() => SessionOutputDto)
  async createSession(@Args('id', { type: () => Int }) id: number): Promise<SessionOutputDto> {
    return this.authService.createSession(id);
  }

  @Query(() => SessionOutputDto)
  async findOpenSessionByGuid(
    @Args('id', { type: () => String }) guid: string,
  ): Promise<SessionOutputDto> {
    return this.authService.getOpenSessionBySessionId(guid);
  }
}
