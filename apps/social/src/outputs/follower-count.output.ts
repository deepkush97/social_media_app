import { ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';

@ObjectType()
export class FollowerCountDto extends AppGraphqlResponse(Number) {}
