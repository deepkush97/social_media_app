import { registerEnumType } from '@nestjs/graphql';

export enum PostStatusEnum {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(PostStatusEnum, {
  name: 'PostStatusEnum',
});
