import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export function Authenticated(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(JwtAuthGuard));
}

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) {
    throw new UnauthorizedException();
  }
  return request.user;
});
