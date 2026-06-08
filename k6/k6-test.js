import { group } from 'k6';
import { postData, uniqueUser } from './helpers/data.js';
import { expect, request } from './helpers/request.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SKIP_UNFOLLOW = __ENV.SKIP_UNFOLLOW === 'true';

export const options = {
  stages: [
    { duration: '5s', target: 20 },
    { duration: '10s', target: 40 },
    { duration: '10s', target: 40 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
    checks: ['rate>0.95'],
  },
};

// DRY Helper for matching deep object fields natively
const matchesFields = (expected) => (actual) => {
  if (!actual || typeof actual !== 'object') return false;
  return Object.entries(expected).every(([key, val]) =>
    typeof val === 'function' ? val(actual[key]) : actual[key] === val,
  );
};

export default function () {
  const user = uniqueUser(__VU, __ITER);
  let token, userId, post1Id, post2Id, searchKeyword;

  // 1. Health
  group('1. Health', () => {
    request('GET', `${BASE_URL}/app`, { label: 'health', expect: expect() });
  });

  // 2. Auth — signup
  group('2. Auth — signup', () => {
    const res = request('POST', `${BASE_URL}/auth/signup`, {
      body: { name: user.name, email: user.email, password: user.password },
      label: 'signup',
      expect: expect({ status: 201, code: 'USER_CREATED' }),
    });
    userId = res.json('data.profile.id');
  });

  // 3. Auth — login
  group('3. Auth — login', () => {
    const res = request('POST', `${BASE_URL}/auth/login`, {
      body: { email: user.email, password: user.password },
      label: 'login',
      expect: expect(),
    });
    token = res.json('data.jwtToken');
  });

  // 4. Profile
  group('4. Profile', () => {
    request('GET', `${BASE_URL}/auth/profile`, {
      token,
      label: 'profile',
      expect: expect({
        data: matchesFields({ profile: matchesFields({ email: user.email, name: user.name }) }),
      }),
    });
  });

  // 5. Posts — create
  group('5. Posts — create', () => {
    const p1 = postData();
    const p2 = postData();
    searchKeyword = p1.keyword;

    const res1 = request('POST', `${BASE_URL}/posts`, {
      body: { title: p1.title, content: p1.content },
      token,
      label: 'create_post_1',
      expect: expect({
        status: 201,
        code: 'OK_CREATED',
        data: matchesFields({ status: 'ACTIVE', title: p1.title, content: p1.content }),
      }),
    });
    post1Id = res1.json('data.id');

    const res2 = request('POST', `${BASE_URL}/posts`, {
      body: { title: p2.title, content: p2.content },
      token,
      label: 'create_post_2',
      expect: expect({
        status: 201,
        code: 'OK_CREATED',
        data: matchesFields({ status: 'ACTIVE', title: p2.title, content: p2.content }),
      }),
    });
    post2Id = res2.json('data.id');
  });

  // 6. Posts — list & get & archive
  group('6. Posts — list & archive', () => {
    request('GET', `${BASE_URL}/posts`, {
      token,
      label: 'list_posts',
      expect: expect({
        data: matchesFields({
          items: (items) =>
            Array.isArray(items) && items.length === 2 && items.every((p) => p.status === 'ACTIVE'),
        }),
      }),
    });

    request('GET', `${BASE_URL}/posts/${post1Id}`, {
      token,
      label: 'get_post_active',
      expect: expect({ data: matchesFields({ status: 'ACTIVE', id: post1Id }) }),
    });

    request('POST', `${BASE_URL}/posts/archive/${post1Id}`, {
      token,
      label: 'archive_post',
      expect: expect(),
    });

    request('GET', `${BASE_URL}/posts/${post1Id}`, {
      token,
      label: 'get_post_archived',
      expect: expect({ data: matchesFields({ status: 'ARCHIVED', id: post1Id }) }),
    });

    request('GET', `${BASE_URL}/posts`, {
      token,
      label: 'list_posts_after_archive',
      expect: expect({
        data: matchesFields({
          items: (items) => items.length === 1 && items[0].status === 'ACTIVE',
        }),
      }),
    });
  });

  // 7. Likes
  group('7. Likes', () => {
    request('POST', `${BASE_URL}/likes/${post1Id}/like`, {
      token,
      label: 'like_post',
      expect: expect({
        status: 201,
        code: 'OK_CREATED',
        data: matchesFields({ postId: post1Id }),
      }),
    });

    request('GET', `${BASE_URL}/likes/${post1Id}/check`, {
      token,
      label: 'check_like',
      expect: expect({ data: (data) => data === true }),
    });

    request('GET', `${BASE_URL}/likes/${post1Id}/count`, {
      token,
      label: 'like_count',
      expect: expect({ data: (data) => data >= 1 }),
    });

    request('POST', `${BASE_URL}/likes/${post1Id}/unlike`, {
      token,
      label: 'unlike_post',
      expect: expect(),
    });

    request('GET', `${BASE_URL}/likes/${post1Id}/count`, {
      token,
      label: 'like_count_after_unlike',
      expect: expect({ data: (data) => data === 0 }),
    });
  });

  // 8. Comments — create, list, reply, archive
  group('8. Comments — create, list, reply, archive', () => {
    const commentContent = `Test comment from VU ${__VU}`;

    // 8a. Create comment on post2Id
    const createRes = request('POST', `${BASE_URL}/posts/${post2Id}/comments`, {
      body: { content: commentContent },
      token,
      label: 'create_comment',
      expect: expect({
        status: 201,
        code: 'OK_CREATED',
        data: matchesFields({
          content: commentContent,
          status: 'ACTIVE',
          parentId: null,
          postId: post2Id,
        }),
      }),
    });
    const commentId = createRes.json('data.id');

    // 8b. List comments — expect 1
    request('GET', `${BASE_URL}/posts/${post2Id}/comments?page=1&take=10`, {
      token,
      label: 'list_comments',
      expect: expect({
        data: matchesFields({
          items: (items) => items.length === 1 && items[0].content === commentContent,
        }),
      }),
    });

    // 8c. Create reply with parentId
    const replyContent = `Reply from VU ${__VU}`;
    const replyRes = request('POST', `${BASE_URL}/posts/${post2Id}/comments`, {
      body: { content: replyContent, parentId: commentId },
      token,
      label: 'create_reply',
      expect: expect({
        status: 201,
        code: 'OK_CREATED',
        data: matchesFields({ content: replyContent, parentId: commentId }),
      }),
    });
    const replyId = replyRes.json('data.id');

    // 8d. List comments — expect 2
    request('GET', `${BASE_URL}/posts/${post2Id}/comments?page=1&take=10`, {
      token,
      label: 'list_comments_after_reply',
      expect: expect({
        data: matchesFields({
          items: (items) => items.length === 2,
        }),
      }),
    });

    // 8e. Archive the reply
    request('POST', `${BASE_URL}/posts/${post2Id}/comments/archive/${replyId}`, {
      token,
      label: 'archive_reply',
      expect: expect(),
    });

    // 8f. List comments — expect 1 ACTIVE (the parent, reply is archived)
    // Default list returns only ACTIVE comments
    request('GET', `${BASE_URL}/posts/${post2Id}/comments?page=1&take=10`, {
      token,
      label: 'list_comments_after_archive',
      expect: expect({
        data: matchesFields({
          items: (items) => items.length === 1 && items[0].id === commentId,
        }),
      }),
    });
  });

  // 9. Search
  group('9. Search', () => {
    const searchEndpoints = [
      { path: `posts?q=${encodeURIComponent(searchKeyword)}`, label: 'search_posts' },
      { path: `users?q=${encodeURIComponent(user.name)}`, label: 'search_users' },
      { path: 'tags?q=creative', label: 'search_tags' },
    ];

    searchEndpoints.forEach(({ path, label }) => {
      request('GET', `${BASE_URL}/search/${path}&page=1&take=10`, {
        token,
        label,
        expect: expect(),
      });
    });
  });

  // 10. Social — follow / unfollow (cross-VU)
  if (__VU > 1 && userId != null) {
    group('10. Social — follow & unfollow', () => {
      const targetUserId = userId - 1;
      if (targetUserId < 1) return;

      request('POST', `${BASE_URL}/users/follow/${targetUserId}`, {
        token,
        label: 'follow_user',
        expect: expect(),
      });

      request('GET', `${BASE_URL}/users/counts`, {
        token,
        label: 'counts_after_follow',
        expect: expect({ data: (data) => data?.followings >= 1 }),
      });

      if (!SKIP_UNFOLLOW) {
        request('POST', `${BASE_URL}/users/unfollow/${targetUserId}`, {
          token,
          label: 'unfollow_user',
          expect: expect(),
        });

        request('GET', `${BASE_URL}/users/counts`, {
          token,
          label: 'counts_after_unfollow',
          expect: expect({ data: (data) => data?.followings >= 0 }),
          retry: { count: 3, delayMs: 500 },
        });
      }
    });
  }

  // 11. Feed
  group('11. Feed', () => {
    request('GET', `${BASE_URL}/feed?page=1&take=10`, {
      token,
      label: 'feed',
      expect: expect({
        data: matchesFields({
          items: (items) =>
            Array.isArray(items) &&
            items.every(
              (item) =>
                typeof item.id === 'number' &&
                typeof item.title === 'string' &&
                typeof item.content === 'string' &&
                typeof item.score === 'number' &&
                typeof item.status === 'string' &&
                Array.isArray(item.tags) &&
                typeof item.userId === 'number',
            ),
          meta: matchesFields({ total: (n) => n >= 0, page: 1, take: 10 }),
        }),
      }),
    });
  });

  // 12. Recommendations — posts
  group('12. Recommendations — posts', () => {
    request('GET', `${BASE_URL}/recommendations/posts?page=1&take=10`, {
      token,
      label: 'recommendations_posts',
      expect: expect({
        data: matchesFields({
          items: (items) =>
            Array.isArray(items) &&
            items.every(
              (item) =>
                typeof item.id === 'number' &&
                typeof item.title === 'string' &&
                typeof item.content === 'string' &&
                typeof item.score === 'number' &&
                typeof item.status === 'string' &&
                Array.isArray(item.tags) &&
                typeof item.userId === 'number',
            ),
          meta: matchesFields({ total: (n) => n >= 0, page: 1, take: 10 }),
        }),
      }),
    });
  });

  // 13. Recommendations — users
  group('13. Recommendations — users', () => {
    request('GET', `${BASE_URL}/recommendations/users?page=1&take=10`, {
      token,
      label: 'recommendations_users',
      expect: expect({
        data: matchesFields({
          items: (items) => Array.isArray(items),
          meta: matchesFields({ total: (n) => n >= 0, page: 1, take: 10 }),
        }),
      }),
    });
  });

  // 14. Auth — logout
  group('14. Auth — logout', () => {
    request('POST', `${BASE_URL}/auth/logout`, { token, label: 'logout', expect: expect() });
  });
}
