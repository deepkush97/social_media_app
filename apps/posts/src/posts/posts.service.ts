import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { INewPostWithUserId, IPost } from '@app/shared/interfaces/post/post.interface';
import { createPaginatedResponse } from '@app/shared/utils/create-paginated-response';
import { extractTags } from '@app/shared/utils/extract-tags';

import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createNewPost(input: INewPostWithUserId): Promise<IPost> {
    const tags = extractTags(input.content);
    const newPost = this.postRepository.create({ ...input, tags });

    return this.postRepository.save(newPost);
  }

  async findPostById(id: number): Promise<IPost | null> {
    return this.postRepository.findOne({
      where: { id },
    });
  }

  async findPostsByUserId(
    userId: number,
    status: PostStatusEnum,
    page = 1,
    take = 10,
  ): Promise<IPaginatedData<IPost> | null> {
    const skip = page > 1 ? (page - 1) * take : 0;

    const [posts, count] = await this.postRepository.findAndCount({
      where: { userId, status },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return createPaginatedResponse(posts, count, page, take);
  }

  async archivePost(id: number): Promise<boolean> {
    await this.postRepository.update({ id }, { status: PostStatusEnum.ARCHIVED });

    return true;
  }
}
