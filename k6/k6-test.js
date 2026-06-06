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
  let token, userId, post1Id, searchKeyword;

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

    request('POST', `${BASE_URL}/posts`, {
      body: { title: p2.title, content: p2.content },
      token,
      label: 'create_post_2',
      expect: expect({
        status: 201,
        code: 'OK_CREATED',
        data: matchesFields({ status: 'ACTIVE', title: p2.title, content: p2.content }),
      }),
    });
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

  // 8. Search
  group('8. Search', () => {
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

  // 9. Social — follow / unfollow (cross-VU)
  if (__VU > 1 && userId != null) {
    group('9. Social — follow & unfollow', () => {
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

  // 10. Auth — logout
  group('10. Auth — logout', () => {
    request('POST', `${BASE_URL}/auth/logout`, { token, label: 'logout', expect: expect() });
  });
}
