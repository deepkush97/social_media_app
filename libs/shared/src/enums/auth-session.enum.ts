import { registerEnumType } from '@nestjs/graphql';

export enum AuthSessionEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

registerEnumType(AuthSessionEnum, {
  name: 'AuthSessionEnum',
});
