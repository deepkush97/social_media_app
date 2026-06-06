import { registerEnumType } from '@nestjs/graphql';

export enum ContentStatusEnum {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(ContentStatusEnum, {
  name: 'ContentStatusEnum',
});
