import { Field, InputType, Int } from '@nestjs/graphql';

import { IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchInput {
  @Field()
  @IsString()
  query: string;

  @Field(() => Int, { defaultValue: 1, nullable: true })
  @IsOptional()
  page?: number;

  @Field(() => Int, { defaultValue: 20, nullable: true })
  @IsOptional()
  take?: number;
}
