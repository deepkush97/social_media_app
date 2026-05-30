import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppCodes } from './enums/app-codes.enum';

@ObjectType()
export class NumberOutputDto {
  @Field(() => Int, { nullable: true })
  data?: number;

  @Field(() => AppCodes)
  code: AppCodes;
}
