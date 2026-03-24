import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateUserInput } from './inputs/create-user.input';
import { LoginUserInput } from './inputs/login-user.input';
import { BooleanOutputDto } from './outputs/Boolean.output';
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

  @Mutation(() => UserOutputDto)
  async loginUser(@Args('input') input: LoginUserInput): Promise<UserOutputDto> {
    return this.authService.loginUser(input);
  }

  @Query(() => UserOutputDto)
  async findUserById(@Args('id', { type: () => Int }) id: number): Promise<UserOutputDto> {
    return this.authService.findUserById(id);
  }

  @Mutation(() => BooleanOutputDto)
  async closeAllOpenSessionByUserId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BooleanOutputDto> {
    return this.authService.closeAllOpenSessionByUserId(id);
  }

  @Mutation(() => BooleanOutputDto)
  async closeSessionBySessionId(
    @Args('guid', { type: () => String }) guid: string,
  ): Promise<BooleanOutputDto> {
    return this.authService.closeSessionBySessionId(guid);
  }

  @Query(() => SessionOutputDto)
  async findOpenSessionByGuid(
    @Args('id', { type: () => String }) guid: string,
  ): Promise<SessionOutputDto> {
    return this.authService.getOpenSessionBySessionId(guid);
  }
}
