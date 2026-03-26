import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { IPaginationInput } from '@app/shared/interfaces/pagination-input.interface';
import { INewUserWithUserId, IPost } from '@app/shared/interfaces/post/post.interface';

import { PostsService } from './posts/posts.service';

@Injectable()
export class AppService {
  constructor(private readonly postsService: PostsService) {}

  async createPost(input: INewUserWithUserId): Promise<IAppResponse<IPost>> {
    const data = await this.postsService.createNewPost(input);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }

  async findPostById(id: number): Promise<IAppResponse<IPost>> {
    const data = await this.postsService.findPostById(id);
    if (!data) {
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
    }

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  async findPostsByUserId(
    userId: number,
    status: PostStatusEnum,
    { take, page }: IPaginationInput,
  ): Promise<IAppResponse<IPaginatedData<IPost>>> {
    const data = await this.postsService.findPostsByUserId(userId, status, page, take);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  async archivePost(id: number): Promise<IAppResponse<boolean>> {
    await this.postsService.archivePost(id);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS });
  }
}
