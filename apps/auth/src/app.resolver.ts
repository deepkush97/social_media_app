import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { BooleanOutputDto } from '@app/shared/boolean.output';

import { CreateUserInput } from './inputs/create-user.input';
import { LoginUserInput } from './inputs/login-user.input';
import { SessionOutputDto } from './outputs/session.output';
import { UserOutputDto } from './outputs/user.output';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly logger: AppLoggerService,
  ) {}

  @Mutation(() => UserOutputDto)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserOutputDto> {
    return this.appService.createUser(input);
  }

  @Mutation(() => SessionOutputDto)
  async createSession(@Args('id', { type: () => Int }) id: number): Promise<SessionOutputDto> {
    this.logger.info('createSession', { context: this.constructor.name });
    return this.appService.createSession(id);
  }

  @Mutation(() => UserOutputDto)
  async loginUser(@Args('input') input: LoginUserInput): Promise<UserOutputDto> {
    this.logger.info('loginUser', { context: this.constructor.name });
    return this.appService.loginUser(input);
  }

  @Query(() => UserOutputDto)
  async findUserById(@Args('id', { type: () => Int }) id: number): Promise<UserOutputDto> {
    return this.appService.findUserById(id);
  }

  @Mutation(() => BooleanOutputDto)
  async closeAllOpenSessionByUserId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BooleanOutputDto> {
    return this.appService.closeAllOpenSessionByUserId(id);
  }

  @Mutation(() => BooleanOutputDto)
  async closeSessionBySessionId(
    @Args('guid', { type: () => String }) guid: string,
  ): Promise<BooleanOutputDto> {
    return this.appService.closeSessionBySessionId(guid);
  }

  @Query(() => SessionOutputDto)
  async findOpenSessionByGuid(
    @Args('id', { type: () => String }) guid: string,
  ): Promise<SessionOutputDto> {
    return this.appService.getOpenSessionBySessionId(guid);
  }
}
