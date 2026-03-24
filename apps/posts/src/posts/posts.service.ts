import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { INewUserWithUserId, IPost } from '@app/shared/interfaces/post/post.interface';

import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createNewPost(input: INewUserWithUserId): Promise<IPost> {
    const newPost = this.postRepository.create(input);

    return this.postRepository.save(newPost);
  }

  async findPostById(id: number): Promise<IPost | null> {
    return this.postRepository.findOne({
      where: { id },
    });
  }

  async findPostsByUserId(userId: number): Promise<IPost[] | null> {
    return this.postRepository.find({
      where: { userId },
    });
  }

  async archivePost(id: number): Promise<boolean> {
    await this.postRepository.update({ id }, { status: PostStatusEnum.ARCHIVED });

    return true;
  }
}
