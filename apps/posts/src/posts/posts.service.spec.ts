import { Repository } from 'typeorm';

import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { INewPostWithUserId } from '@app/shared/interfaces/post/post.interface';
import { createMockRepo, MockRepository } from '@app/shared/test-utils/repository.mock';

import { Comment } from './entities/comment.entity';
import { Post } from './entities/post.entity';

import { PostsService } from './posts.service';

function stubPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    title: '',
    content: '',
    userId: 0,
    status: ContentStatusEnum.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    image: undefined,
    ...overrides,
  } as Post;
}

describe('PostsService', () => {
  let service: PostsService;
  let mockRepo: MockRepository;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new PostsService(
      mockRepo as unknown as Repository<Post>,
      createMockRepo() as unknown as Repository<Comment>,
    );
  });

  describe('createNewPost', () => {
    it('creates and saves a post', async () => {
      const input: INewPostWithUserId = { title: 'Test', content: 'Content', userId: 1 };
      const created = stubPost({ ...input });
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.createNewPost(input);

      expect(mockRepo.create).toHaveBeenCalledWith({ ...input, tags: [] });
      expect(mockRepo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });
  });

  describe('findPostById', () => {
    it('returns a post when found', async () => {
      const post = stubPost({ id: 1, title: 'Test' });
      mockRepo.findOne.mockResolvedValue(post);

      const result = await service.findPostById(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(post);
    });

    it('returns null when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.findPostById(999);

      expect(result).toBeNull();
    });
  });

  describe('findPostsByUserId', () => {
    const posts = [stubPost({ id: 1 }), stubPost({ id: 2 })];

    it('returns paginated posts for a user', async () => {
      mockRepo.findAndCount.mockResolvedValue([posts, 5]);

      const result = await service.findPostsByUserId(1, ContentStatusEnum.ACTIVE, 1, 10);

      expect(mockRepo.findAndCount).toHaveBeenCalledWith({
        where: { userId: 1, status: ContentStatusEnum.ACTIVE },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result.meta).toEqual({ total: 5, page: 1, lastPage: 1, take: 10 });
    });

    it('calculates skip correctly for page 2', async () => {
      mockRepo.findAndCount.mockResolvedValue([posts, 20]);

      await service.findPostsByUserId(1, ContentStatusEnum.ACTIVE, 2, 10);

      expect(mockRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({ skip: 10 }));
    });

    it('returns empty result when no posts', async () => {
      mockRepo.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findPostsByUserId(1, ContentStatusEnum.ACTIVE, 1, 10);

      expect(result.items).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('archivePost', () => {
    it('updates post status to ARCHIVED and returns true', async () => {
      const result = await service.archivePost(1);

      expect(mockRepo.update).toHaveBeenCalledWith(
        { id: 1 },
        { status: ContentStatusEnum.ARCHIVED },
      );
      expect(result).toBe(true);
    });
  });
});
