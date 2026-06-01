import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchInput {
  @Field()
  query: string;

  @Field(() => Int, { defaultValue: 1, nullable: true })
  page?: number;

  @Field(() => Int, { defaultValue: 20, nullable: true })
  take?: number;
}
