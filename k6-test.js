import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    {
      duration: '30s',
      target: 20,
    },
    {
      duration: '1m',
      target: 20,
    },
    {
      duration: '30s',
      target: 0,
    },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = 'http://localhost:3000';

const request = ({ endpoint, payload, token, isPost = true }) => {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  return isPost
    ? http.post(endpoint, payload ? JSON.stringify(payload) : null, params)
    : http.get(endpoint, params);
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

  const signupRes = request({ endpoint: `${BASE_URL}/auth/signup`, payload: registerPayload });

  check(signupRes, {
    signup_success: (r) => {
      const body = JSON.parse(r.body);

      return r.status === 201 && body.code === 'USER_CREATED';
    },
  });

  const userId = signupRes.json().data?.profile.id;

  const loginRes = request({ endpoint: `${BASE_URL}/auth/login`, payload: loginPayload });

  check(loginRes, {
    login_success: (r) => {
      const body = JSON.parse(r.body);
      return r.status === 200 && body.code === 'OPERATION_SUCCESS';
    },
  });

  const token = loginRes.json().data?.jwtToken;

  const profileRes = request({ endpoint: `${BASE_URL}/auth/profile`, isPost: false, token });
  check(profileRes, {
    profile_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data.profile;

      return (
        r.status === 200 &&
        body.code === 'OPERATION_SUCCESS' &&
        registerPayload.email === data.email &&
        registerPayload.name === data.name
      );
    },
  });

  const newPost1Payload = {
    title: `${registerPayload.name}_1`,
    content: `${registerPayload.email}_1`,
  };
  const newPost2Payload = {
    title: `${registerPayload.name}_2`,
    content: `${registerPayload.email}_2`,
  };

  const newPost1Res = request({ endpoint: `${BASE_URL}/posts`, payload: newPost1Payload, token });
  check(newPost1Res, {
    new_post_1_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data;

      return (
        r.status === 201 &&
        body.code === 'OK_CREATED' &&
        data.status === 'ACTIVE' &&
        newPost1Payload.title === data.title &&
        newPost1Payload.content === data.content
      );
    },
  });

  const post1Id = newPost1Res.json().data?.id;

  const newPost2Res = request({ endpoint: `${BASE_URL}/posts`, payload: newPost2Payload, token });
  check(newPost2Res, {
    new_post_2_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data;

      return (
        r.status === 201 &&
        body.code === 'OK_CREATED' &&
        data.status === 'ACTIVE' &&
        newPost2Payload.title === data.title &&
        newPost2Payload.content === data.content
      );
    },
  });

  const postListRes = request({ endpoint: `${BASE_URL}/posts`, isPost: false, token });
  check(postListRes, {
    post_list_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data.items;

      return (
        r.status === 200 &&
        body.code === 'OPERATION_SUCCESS' &&
        data.length === 2 &&
        newPost2Payload.title === data[0].title &&
        newPost2Payload.content === data[0].content &&
        data[0].status === 'ACTIVE' &&
        newPost1Payload.title === data[1].title &&
        newPost1Payload.content === data[1].content &&
        data[1].status === 'ACTIVE'
      );
    },
  });

  const getPostActiveRes = request({
    endpoint: `${BASE_URL}/posts/${post1Id}`,
    isPost: false,
    token,
  });
  check(getPostActiveRes, {
    get_post_active_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data;

      return (
        r.status === 200 &&
        body.code === 'OPERATION_SUCCESS' &&
        newPost1Payload.title === data.title &&
        newPost1Payload.content === data.content &&
        data.status === 'ACTIVE' &&
        data.id === post1Id
      );
    },
  });

  const archivePostRes = request({ endpoint: `${BASE_URL}/posts/archive/${post1Id}`, token });
  check(archivePostRes, {
    archive_post_success: (r) => {
      const body = JSON.parse(r.body);

      return r.status === 200 && body.code === 'OPERATION_SUCCESS';
    },
  });

  const getPostArchiveRes = request({
    endpoint: `${BASE_URL}/posts/${post1Id}`,
    isPost: false,
    token,
  });
  check(getPostArchiveRes, {
    get_post_archive_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data;

      return (
        r.status === 200 &&
        body.code === 'OPERATION_SUCCESS' &&
        newPost1Payload.title === data.title &&
        newPost1Payload.content === data.content &&
        data.status === 'ARCHIVED' &&
        data.id === post1Id
      );
    },
  });

  const postListWithArchivedRes = request({ endpoint: `${BASE_URL}/posts`, isPost: false, token });
  check(postListWithArchivedRes, {
    post_list_with_archived_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data.items;

      return (
        r.status === 200 &&
        body.code === 'OPERATION_SUCCESS' &&
        newPost2Payload.title === data[0].title &&
        newPost2Payload.content === data[0].content &&
        data[0].status === 'ACTIVE'
      );
    },
  });

  if (__VU === 1) {
    return;
  }

  const targetUserId = userId - 1;

  const followUserRes = request({ endpoint: `${BASE_URL}/users/follow/${targetUserId}`, token });
  check(followUserRes, {
    follow_user_success: (r) => {
      const body = JSON.parse(r.body);

      return r.status === 200 && body.code === 'OPERATION_SUCCESS';
    },
  });

  const userCountsAfterFollowRes = request({
    endpoint: `${BASE_URL}/users/counts`,
    isPost: false,
    token,
  });
  check(userCountsAfterFollowRes, {
    user_count_after_follow_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data;

      const isSuccess =
        r.status === 200 && body.code === 'OPERATION_SUCCESS' && data.followings === 1;
      if (!isSuccess) {
        console.log('>>>>>', r.status, body);
        console.log('>>>>>', userId, targetUserId);
      }
      return isSuccess;
    },
  });

  const unfollowUserRes = request({
    endpoint: `${BASE_URL}/users/unfollow/${targetUserId}`,
    token,
  });
  check(unfollowUserRes, {
    unfollow_user_success: (r) => {
      const body = JSON.parse(r.body);

      return r.status === 200 && body.code === 'OPERATION_SUCCESS';
    },
  });

  const userCountsAfterUnfollowRes = request({
    endpoint: `${BASE_URL}/users/counts`,
    isPost: false,
    token,
  });
  check(userCountsAfterUnfollowRes, {
    user_count_after_unfollow_success: (r) => {
      const body = JSON.parse(r.body);
      const data = body.data;
      const isSuccess =
        r.status === 200 && body.code === 'OPERATION_SUCCESS' && data.followings === 0;
      if (!isSuccess) {
        console.log('>>>>>', r.status, body);
        console.log('>>>>>', userId, targetUserId);
      }
      return isSuccess;
    },
  });

  const logoutRes = request({ endpoint: `${BASE_URL}/auth/logout`, token });
  check(logoutRes, {
    logout_success: (r) => {
      const body = JSON.parse(r.body);

      return r.status === 200 && body.code === 'OPERATION_SUCCESS';
    },
  });
}
