import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { INewUserWithUserId, IPost } from '@app/shared/interfaces/post/post.interface';

import { PostsService } from './posts/posts.service';

@Injectable()
export class AppService {
  constructor(private readonly postsService: PostsService) {}

  async createPost(input: INewUserWithUserId): Promise<IAppResponse<IPost>> {
    const data = await this.postsService.createNewPost(input);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }
}
