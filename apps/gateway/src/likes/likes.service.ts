import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';

@Injectable()
export class LikesService {
  constructor(private readonly routerComposite: GraphqlRouterComposite) {}

  async likePost(
    userId: number,
    postId: number,
  ): Promise<IAppResponse<{ id: number; userId: number; postId: number; createdAt: Date }>> {
    const result = await this.routerComposite.likePost(
      { userId, postId },
      {
        data: { id: true, userId: true, postId: true, createdAt: true },
        code: true,
      },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }
    return new AppResponse({ code: AppCodes.OK_CREATED, data: result.data });
  }

  async unlikePost(userId: number, postId: number): Promise<IAppResponse<boolean>> {
    const result = await this.routerComposite.unlikePost(
      { userId, postId },
      { data: true, code: true },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[result.code] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data ?? true });
  }

  async postLikeCount(postId: number): Promise<IAppResponse<number>> {
    const result = await this.routerComposite.postLikeCount(postId, { data: true, code: true });
    if (result.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[result.code] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data ?? 0 });
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<IAppResponse<boolean>> {
    const result = await this.routerComposite.hasUserLikedPost(userId, postId, {
      data: true,
      code: true,
    });
    if (result.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[result.code] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data ?? false });
  }
}
