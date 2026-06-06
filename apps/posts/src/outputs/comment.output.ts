import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { IComment } from '@app/shared/interfaces/comment/comment.interface';

@ObjectType()
export class CommentOutput implements IComment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  postId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field()
  content: string;

  @Field(() => ContentStatusEnum)
  status: ContentStatusEnum;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CommentOutputDto extends AppGraphqlResponse(CommentOutput) {}

@ObjectType()
export class CommentListOutputDto extends AppPaginatedDataGraphqlResponse(CommentOutput) {}
