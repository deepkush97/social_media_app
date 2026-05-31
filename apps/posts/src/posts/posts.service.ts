import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { INewPostWithUserId, IPost } from '@app/shared/interfaces/post/post.interface';
import { createPaginatedResponse } from '@app/shared/utils/create-paginated-response';

import { Post } from './entities/post.entity';
import { PostTag } from './entities/post-tag.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(PostTag)
    private readonly postTagRepository: Repository<PostTag>,
  ) {}

  async createNewPost(input: INewPostWithUserId): Promise<IPost> {
    const newPost = this.postRepository.create(input);

    return this.postRepository.save(newPost);
  }

  async findOrCreateTags(
    postId: number,
    tagNames: string[],
  ): Promise<{ id: number; name: string }[]> {
    const createdTags: { id: number; name: string }[] = [];

    for (const name of tagNames) {
      const trimmed = name.trim().toLowerCase();
      if (!trimmed) continue;

      let tag = await this.tagRepository.findOne({ where: { name: trimmed } });
      if (!tag) {
        tag = this.tagRepository.create({ name: trimmed });
        tag = await this.tagRepository.save(tag);
        createdTags.push({ id: tag.id, name: tag.name });
      }

      const existingPostTag = await this.postTagRepository.findOne({
        where: { postId, tagId: tag.id },
      });
      if (!existingPostTag) {
        const postTag = this.postTagRepository.create({ postId, tagId: tag.id });
        await this.postTagRepository.save(postTag);
      }
    }

    return createdTags;
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
