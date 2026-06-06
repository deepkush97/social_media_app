import { ExecutionContext, NotFoundException } from '@nestjs/common';

import { describe, expect, it, vi } from 'vitest';

import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

import { PostExistsGuard } from './post-exists.guard';

const mockPost: IPost = {
  id: 1,
  userId: 10,
  title: 'Test Post',
  content: 'Test content',
  tags: ['test'],
  status: ContentStatusEnum.ACTIVE,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

interface MockPostsService {
  findPostById: ReturnType<typeof vi.fn>;
}

function createMockService(
  findPostById: (id: number) => Promise<{ code: string; data?: IPost | undefined }>,
): MockPostsService {
  return { findPostById: vi.fn().mockImplementation(findPostById) };
}

function createMockExecutionContext(postId: string): ExecutionContext {
  const request: { params: Record<string, string>; post?: IPost } = { params: { postId } };

  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('PostExistsGuard', () => {
  it('returns true and sets request.post when post exists', async () => {
    const postsService = createMockService(async () => ({
      code: AppCodes.OPERATION_SUCCESS,
      data: mockPost,
    }));
    const guard = new PostExistsGuard(postsService as never);
    const context = createMockExecutionContext('1');

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect((context.switchToHttp().getRequest() as { post?: IPost }).post).toEqual(mockPost);
    expect(postsService.findPostById).toHaveBeenCalledWith(1);
  });

  it('throws NotFoundException when post does not exist', async () => {
    const postsService = createMockService(async () => ({
      code: AppCodes.NOT_FOUND,
    }));
    const guard = new PostExistsGuard(postsService as never);

    await expect(guard.canActivate(createMockExecutionContext('99'))).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws NotFoundException when postId is not a number', async () => {
    const postsService = createMockService(async () => ({
      code: AppCodes.OPERATION_SUCCESS,
      data: mockPost,
    }));
    const guard = new PostExistsGuard(postsService as never);

    await expect(guard.canActivate(createMockExecutionContext('abc'))).rejects.toThrow(
      NotFoundException,
    );
  });

  it('does not call findPostById for invalid postId', async () => {
    const postsService = createMockService(async () => ({
      code: AppCodes.OPERATION_SUCCESS,
      data: mockPost,
    }));
    const guard = new PostExistsGuard(postsService as never);

    await expect(guard.canActivate(createMockExecutionContext('abc'))).rejects.toThrow(
      NotFoundException,
    );
    expect(postsService.findPostById).not.toHaveBeenCalled();
  });
});
