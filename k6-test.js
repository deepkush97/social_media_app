import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    {
      duration: '5s',
      target: 20,
    },
    {
      duration: '5s',
      target: 40,
    },
    {
      duration: '5s',
      target: 0,
    },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = 'http://localhost:3000';

const requestAndCheck = ({ endpoint, payload, token, isPost = true, label, checkCondition }) => {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const jsonPayload = payload ? JSON.stringify(payload) : null;

  const result = isPost ? http.post(endpoint, jsonPayload, params) : http.get(endpoint, params);

  check(result, {
    [label]: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data;
      const code = body.code;
      const isSuccess = checkCondition(r, data, code);
      if (!isSuccess) {
        console.log(`FAILURE : ${label}`);
        console.log('endpoint:', endpoint);
        console.log('payload:', jsonPayload);
        console.log('status:', r.status);
        console.log('body:', body);
        console.log();
      }
      return isSuccess;
    },
  });

  return result;
};

export default function () {
  const uniqueId = `u_${__VU}_${__ITER}_${Date.now().toLocaleString()}`;

  const loginPayload = {
    email: `${uniqueId}@example.com`,
    password: '123456',
  };

  const registerPayload = {
    name: uniqueId,
    ...loginPayload,
  };

  const signupRes = requestAndCheck({
    endpoint: `${BASE_URL}/auth/signup`,
    payload: registerPayload,
    label: 'signup',
    checkCondition: (r, data, code) => r.status === 201 && code === 'USER_CREATED',
  });

  const userId = signupRes.json().data?.profile.id;

  const loginRes = requestAndCheck({
    endpoint: `${BASE_URL}/auth/login`,
    payload: loginPayload,
    label: 'login',
    checkCondition: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
  });

  const token = loginRes.json().data?.jwtToken;

  const profileRes = requestAndCheck({
    endpoint: `${BASE_URL}/auth/profile`,
    isPost: false,
    token,
    label: 'profile',
    checkCondition: (r, data, code) =>
      r.status === 200 &&
      code === 'OPERATION_SUCCESS' &&
      registerPayload.email === data.profile.email &&
      registerPayload.name === data.profile.name,
  });

  const post1 = {
    title: `${registerPayload.name}_1`,
    content: `${registerPayload.email}_1`,
  };
  const post2 = {
    title: `${registerPayload.name}_2`,
    content: `${registerPayload.email}_2`,
  };

  const newPost1Res = requestAndCheck({
    endpoint: `${BASE_URL}/posts`,
    payload: post1,
    token,
    label: 'new_post_1',
    checkCondition: (r, data, code) =>
      r.status === 201 &&
      code === 'OK_CREATED' &&
      data.status === 'ACTIVE' &&
      post1.title === data.title &&
      post1.content === data.content,
  });

  const post1Id = newPost1Res.json().data?.id;

  requestAndCheck({
    endpoint: `${BASE_URL}/posts`,
    payload: post2,
    token,
    label: 'new_post_2',
    checkCondition: (r, data, code) =>
      r.status === 201 &&
      code === 'OK_CREATED' &&
      data.status === 'ACTIVE' &&
      post2.title === data.title &&
      post2.content === data.content,
  });

  requestAndCheck({
    endpoint: `${BASE_URL}/posts`,
    isPost: false,
    token,
    label: 'post_list',
    checkCondition: (r, data, code) =>
      r.status === 200 &&
      code === 'OPERATION_SUCCESS' &&
      data.items.length === 2 &&
      post2.title === data.items[0].title &&
      post2.content === data.items[0].content &&
      data.items[0].status === 'ACTIVE' &&
      post1.title === data.items[1].title &&
      post1.content === data.items[1].content &&
      data.items[1].status === 'ACTIVE',
  });

  const getPostActiveRes = requestAndCheck({
    endpoint: `${BASE_URL}/posts/${post1Id}`,
    isPost: false,
    token,
    label: 'get_post_active',
    checkCondition: (r, data, code) =>
      r.status === 200 &&
      code === 'OPERATION_SUCCESS' &&
      post1.title === data.title &&
      post1.content === data.content &&
      data.status === 'ACTIVE' &&
      data.id === post1Id,
  });

  const archivePostRes = requestAndCheck({
    endpoint: `${BASE_URL}/posts/archive/${post1Id}`,
    token,
    label: 'archive_post',
    checkCondition: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
  });

  requestAndCheck({
    endpoint: `${BASE_URL}/posts/${post1Id}`,
    isPost: false,
    token,
    label: 'get_post_archive',
    checkCondition: (r, data, code) =>
      r.status === 200 &&
      code === 'OPERATION_SUCCESS' &&
      post1.title === data.title &&
      post1.content === data.content &&
      data.status === 'ARCHIVED' &&
      data.id === post1Id,
  });

  requestAndCheck({
    endpoint: `${BASE_URL}/posts`,
    isPost: false,
    token,
    label: 'post_list_with_archived',
    checkCondition: (r, data, code) =>
      r.status === 200 &&
      code === 'OPERATION_SUCCESS' &&
      post2.title === data.items[0].title &&
      post2.content === data.items[0].content &&
      data.items[0].status === 'ACTIVE',
  });

  if (__VU === 1) {
    return;
  }

  const targetUserId = userId - 1;

  requestAndCheck({
    endpoint: `${BASE_URL}/users/follow/${targetUserId}`,
    token,
    label: 'follow_user',
    checkCondition: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
  });

  requestAndCheck({
    endpoint: `${BASE_URL}/users/counts`,
    isPost: false,
    token,
    label: 'user_count_after_follow',
    checkCondition: (r, data, code) =>
      r.status === 200 && code === 'OPERATION_SUCCESS' && data.followings >= 1,
  });

  requestAndCheck({
    endpoint: `${BASE_URL}/users/unfollow/${targetUserId}`,
    token,
    label: 'unfollow_user',
    checkCondition: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
  });

  requestAndCheck({
    endpoint: `${BASE_URL}/users/counts`,
    isPost: false,
    token,
    label: 'user_count_after_unfollow',
    checkCondition: (r, data, code) =>
      r.status === 200 && code === 'OPERATION_SUCCESS' && data.followings === 0,
  });

  requestAndCheck({
    endpoint: `${BASE_URL}/auth/logout`,
    token,
    label: 'logout',
    checkCondition: (r, data, code) => r.status === 200 && code === 'OPERATION_SUCCESS',
  });
}
