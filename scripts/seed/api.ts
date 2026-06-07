import type { SeedPost, SeedUser } from './utils';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function apiFetch(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {},
): Promise<{ status: number; data: unknown }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const body = await res.json().catch(() => ({}));

  return { status: res.status, data: body };
}

export async function signup(user: SeedUser): Promise<{ userId: number; token: string }> {
  const res = await apiFetch('/auth/signup', {
    method: 'POST',
    body: { name: user.name, email: user.email, password: user.password },
  });

  const data = res.data as { data?: { profile?: { id?: number }; jwtToken?: string } };
  const profile = data?.data?.profile;
  const jwtToken = data?.data?.jwtToken;

  if (!profile?.id || !jwtToken) {
    throw new Error(`Signup failed for ${user.email}: ${JSON.stringify(res.data)}`);
  }

  return { userId: profile.id, token: jwtToken };
}

export async function createPost(token: string, post: SeedPost): Promise<number> {
  const contentWithTags = `${post.content}\n\n${post.tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ')}`;

  const res = await apiFetch('/posts', {
    method: 'POST',
    token,
    body: { title: post.title, content: contentWithTags },
  });

  const data = res.data as { data?: { id?: number } };

  if (!data?.data?.id) {
    throw new Error(`Create post failed: ${JSON.stringify(res.data)}`);
  }

  return data.data.id;
}

export async function followUser(token: string, targetId: number): Promise<number> {
  const res = await apiFetch(`/users/follow/${targetId}`, {
    method: 'POST',
    token,
  });

  return res.status;
}

export async function likePost(token: string, postId: number): Promise<number> {
  const res = await apiFetch(`/likes/${postId}/like`, {
    method: 'POST',
    token,
  });

  return res.status;
}
