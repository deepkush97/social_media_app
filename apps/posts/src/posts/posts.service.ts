import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { IComment, INewCommentWithUserId } from '@app/shared/interfaces/comment/comment.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { INewPostWithUserId, IPost } from '@app/shared/interfaces/post/post.interface';
import { createPaginatedResponse } from '@app/shared/utils/create-paginated-response';
import { extractTags } from '@app/shared/utils/extract-tags';

import { Comment } from './entities/comment.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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
    status: ContentStatusEnum,
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
    await this.postRepository.update({ id }, { status: ContentStatusEnum.ARCHIVED });

    return true;
  }

  async createComment(input: INewCommentWithUserId): Promise<IComment> {
    const newComment = this.commentRepository.create(input);

    return this.commentRepository.save(newComment);
  }

  async findCommentById(id: number): Promise<IComment | null> {
    return this.commentRepository.findOne({ where: { id } });
  }

  async findCommentsByPostId(
    postId: number,
    page = 1,
    take = 10,
    status = ContentStatusEnum.ACTIVE,
  ): Promise<IPaginatedData<IComment> | null> {
    const skip = page > 1 ? (page - 1) * take : 0;

    const [comments, count] = await this.commentRepository.findAndCount({
      where: { postId, status },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return createPaginatedResponse(comments, count, page, take);
  }

  async archiveComment(id: number): Promise<boolean> {
    await this.commentRepository.update({ id }, { status: ContentStatusEnum.ARCHIVED });

    return true;
  }
}
