import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { AppCodes } from './enums/app-codes.enum';

export function AppGraphqlResponse<T>(WrappingType: Type<T>): Type<{ data?: T; code: AppCodes }> {
  @ObjectType({ isAbstract: true })
  abstract class ResponseClass {
    @Field(() => WrappingType, { nullable: true })
    data?: T;

    @Field(() => AppCodes)
    code: AppCodes;
  }

  return ResponseClass as Type<{ data?: T; code: AppCodes }>;
}
