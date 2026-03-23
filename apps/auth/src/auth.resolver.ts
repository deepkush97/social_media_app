import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';

import { CreateUserInput } from './inputs/create-user.input';
import { UserOutputDto } from './outputs/user.output';

import { AuthService } from './auth.service';
import { SessionOutputDto } from './outputs/session.output';

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
}
