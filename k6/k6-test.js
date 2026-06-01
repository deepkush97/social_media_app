import { group } from 'k6';

import { postData, uniqueUser } from './helpers/data.js';
import { request } from './helpers/request.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '5s', target: 20 },
    { duration: '10s', target: 40 },
    { duration: '10s', target: 40 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    checks: ['rate>0.95'],
  },
};

function ok(r, data, code) {
  return r.status === 200 && code === 'OPERATION_SUCCESS';
}

function created(r, data, code) {
  return r.status === 201 && code === 'OPERATION_SUCCESS';
}

export default function () {
  const user = uniqueUser(__VU, __ITER);
  let token;
  let userId;
  let post1Id;
  let searchKeyword;

  // ──────────────────────────────────────────────
  // 1. Health
  // ──────────────────────────────────────────────
  group('1. Health', () => {
    request('GET', `${BASE_URL}/app`, {
      label: 'health',
      checks: ok,
    });
  });

  // ──────────────────────────────────────────────
  // 2. Auth — signup
  // ──────────────────────────────────────────────
  group('2. Auth — signup', () => {
    const signupRes = request('POST', `${BASE_URL}/auth/signup`, {
      body: { name: user.name, email: user.email, password: user.password },
      label: 'signup',
      checks: (r, data, code) => r.status === 201 && code === 'USER_CREATED',
    });

    userId = signupRes.json('data.profile.id');
  });

  // ──────────────────────────────────────────────
  // 3. Auth — login
  // ──────────────────────────────────────────────
  group('3. Auth — login', () => {
    const loginRes = request('POST', `${BASE_URL}/auth/login`, {
      body: { email: user.email, password: user.password },
      label: 'login',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
    });

    token = loginRes.json('data.jwtToken');
  });

  // ──────────────────────────────────────────────
  // 4. Profile
  // ──────────────────────────────────────────────
  group('4. Profile', () => {
    request('GET', `${BASE_URL}/auth/profile`, {
      token,
      label: 'profile',
      checks: (r, data, code) =>
        r.status === 200 &&
        code === 'OPERATION_SUCCESS' &&
        data.profile.email === user.email &&
        data.profile.name === user.name,
    });
  });

  // ──────────────────────────────────────────────
  // 5. Posts — create
  // ──────────────────────────────────────────────
  group('5. Posts — create', () => {
    const p1 = postData();
    const p2 = postData();
    const post1 = { title: p1.title, content: p1.content };
    const post2 = { title: p2.title, content: p2.content };

    const newPost1Res = request('POST', `${BASE_URL}/posts`, {
      body: post1,
      token,
      label: 'create_post_1',
      checks: (r, data, code) =>
        r.status === 201 &&
        code === 'OK_CREATED' &&
        data.status === 'ACTIVE' &&
        data.title === post1.title &&
        data.content === post1.content,
    });

    post1Id = newPost1Res.json('data.id');
    searchKeyword = p1.keyword;

    request('POST', `${BASE_URL}/posts`, {
      body: post2,
      token,
      label: 'create_post_2',
      checks: (r, data, code) =>
        r.status === 201 &&
        code === 'OK_CREATED' &&
        data.status === 'ACTIVE' &&
        data.title === post2.title &&
        data.content === post2.content,
    });
  });

  // ──────────────────────────────────────────────
  // 6. Posts — list & get & archive
  // ──────────────────────────────────────────────
  group('6. Posts — list & archive', () => {
    request('GET', `${BASE_URL}/posts`, {
      token,
      label: 'list_posts',
      checks: (r, data, code) =>
        r.status === 200 &&
        code === 'OPERATION_SUCCESS' &&
        data.items.length === 2 &&
        data.items.every((p) => p.status === 'ACTIVE'),
    });

    request('GET', `${BASE_URL}/posts/${post1Id}`, {
      token,
      label: 'get_post_active',
      checks: (r, data, code) =>
        r.status === 200 &&
        code === 'OPERATION_SUCCESS' &&
        data.status === 'ACTIVE' &&
        data.id === post1Id,
    });

    request('POST', `${BASE_URL}/posts/archive/${post1Id}`, {
      token,
      label: 'archive_post',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
    });

    request('GET', `${BASE_URL}/posts/${post1Id}`, {
      token,
      label: 'get_post_archived',
      checks: (r, data, code) =>
        r.status === 200 &&
        code === 'OPERATION_SUCCESS' &&
        data.status === 'ARCHIVED' &&
        data.id === post1Id,
    });

    request('GET', `${BASE_URL}/posts`, {
      token,
      label: 'list_posts_after_archive',
      checks: (r, data, code) =>
        r.status === 200 &&
        code === 'OPERATION_SUCCESS' &&
        data.items.length === 1 &&
        data.items[0].status === 'ACTIVE',
    });
  });

  // ──────────────────────────────────────────────
  // 7. Likes
  // ──────────────────────────────────────────────
  group('7. Likes', () => {
    request('POST', `${BASE_URL}/likes/like/${post1Id}`, {
      token,
      label: 'like_post',
      checks: (r, data, code) =>
        r.status === 201 && code === 'OK_CREATED' && data.id > 0 && data.postId === post1Id,
    });

    request('GET', `${BASE_URL}/likes/check/${post1Id}`, {
      token,
      label: 'check_like',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS' && data === true,
    });

    request('GET', `${BASE_URL}/likes/count/${post1Id}`, {
      token,
      label: 'like_count',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS' && data >= 1,
    });

    request('POST', `${BASE_URL}/likes/unlike/${post1Id}`, {
      token,
      label: 'unlike_post',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
    });

    request('GET', `${BASE_URL}/likes/count/${post1Id}`, {
      token,
      label: 'like_count_after_unlike',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS' && data === 0,
    });
  });

  // ──────────────────────────────────────────────
  // 8. Search
  // ──────────────────────────────────────────────
  group('8. Search', () => {
    request(
      'GET',
      `${BASE_URL}/search/posts?q=${encodeURIComponent(searchKeyword)}&page=1&take=10`,
      {
        token,
        label: 'search_posts',
        checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
      },
    );

    request('GET', `${BASE_URL}/search/users?q=${encodeURIComponent(user.name)}&page=1&take=10`, {
      token,
      label: 'search_users',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
    });

    request('GET', `${BASE_URL}/search/tags?q=creative&page=1&take=10`, {
      token,
      label: 'search_tags',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
    });
  });

  // ──────────────────────────────────────────────
  // 9. Social — follow / unfollow (cross-VU)
  // ──────────────────────────────────────────────
  if (__VU > 1) {
    group('9. Social — follow & unfollow', () => {
      const targetUserId = userId - 1;

      request('POST', `${BASE_URL}/users/follow/${targetUserId}`, {
        token,
        label: 'follow_user',
        checks: ok,
      });

      request('GET', `${BASE_URL}/users/counts`, {
        token,
        label: 'counts_after_follow',
        checks: (r, data, code) =>
          r.status === 200 && code === 'OPERATION_SUCCESS' && data.followings >= 1,
      });

      request('POST', `${BASE_URL}/users/unfollow/${targetUserId}`, {
        token,
        label: 'unfollow_user',
        checks: ok,
      });

      request('GET', `${BASE_URL}/users/counts`, {
        token,
        label: 'counts_after_unfollow',
        checks: (r, data, code) =>
          r.status === 200 && code === 'OPERATION_SUCCESS' && data.followings === 0,
      });
    });
  }

  // ──────────────────────────────────────────────
  // 10. Auth — logout (all VUs)
  // ──────────────────────────────────────────────
  group('10. Auth — logout', () => {
    request('POST', `${BASE_URL}/auth/logout`, {
      token,
      label: 'logout',
      checks: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
    });
  });
}
