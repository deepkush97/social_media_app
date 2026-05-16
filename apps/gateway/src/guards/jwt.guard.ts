import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export function Authenticated(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) {
    throw new UnauthorizedException();
  }
  return request.user;
});
