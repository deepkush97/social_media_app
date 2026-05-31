import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(private readonly esService: ElasticsearchService) {}

  async onModuleInit(): Promise<void> {
    await this.ensureIndex('posts', {
      settings: {
        analysis: {
          filter: {
            synonyms_filter: {
              type: 'synonym',
              synonyms: [
                'js, javascript, typescript',
                'react, reactjs, react.js',
                'node, nodejs, node.js',
                'ts, typescript',
              ],
            },
          },
          analyzer: {
            synonym_analyzer: {
              tokenizer: 'standard',
              filter: ['lowercase', 'synonyms_filter'],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: 'integer' },
          title: { type: 'text', analyzer: 'synonym_analyzer' },
          content: { type: 'text', analyzer: 'synonym_analyzer' },
          userId: { type: 'integer' },
          createdAt: { type: 'date' },
        },
      },
    });

    await this.ensureIndex('users', {
      settings: {
        analysis: {
          analyzer: {
            autocomplete: {
              tokenizer: 'autocomplete',
              filter: ['lowercase'],
            },
          },
          tokenizer: {
            autocomplete: {
              type: 'edge_ngram',
              min_gram: 1,
              max_gram: 20,
              token_chars: ['letter', 'digit'],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: 'integer' },
          username: {
            type: 'text',
            analyzer: 'autocomplete',
            fields: { raw: { type: 'keyword' } },
          },
          displayName: {
            type: 'text',
            analyzer: 'autocomplete',
          },
        },
      },
    });

    await this.ensureIndex('tags', {
      settings: {
        analysis: {
          analyzer: {
            autocomplete: {
              tokenizer: 'autocomplete',
              filter: ['lowercase'],
            },
          },
          tokenizer: {
            autocomplete: {
              type: 'edge_ngram',
              min_gram: 1,
              max_gram: 20,
              token_chars: ['letter', 'digit'],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: 'integer' },
          name: {
            type: 'text',
            analyzer: 'autocomplete',
            fields: { raw: { type: 'keyword' } },
          },
        },
      },
    });
  }

  private async ensureIndex(
    name: string,
    spec: { settings?: Record<string, unknown>; mappings: Record<string, unknown> },
  ): Promise<void> {
    const exists = await this.esService.indices.exists({ index: name });
    if (!exists) {
      await this.esService.indices.create({ index: name, ...spec });
    }
  }

  async indexPost(post: {
    id: number;
    title: string;
    content?: string;
    userId: number;
    createdAt?: string;
  }): Promise<void> {
    await this.esService.index({
      index: 'posts',
      id: String(post.id),
      document: {
        id: post.id,
        title: post.title,
        content: post.content,
        userId: post.userId,
        createdAt: post.createdAt ?? new Date().toISOString(),
      },
    });
  }

  async indexUser(user: { id: number; username: string; displayName?: string }): Promise<void> {
    await this.esService.index({
      index: 'users',
      id: String(user.id),
      document: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
      },
    });
  }

  async indexTag(tag: { id: number; name: string }): Promise<void> {
    await this.esService.index({
      index: 'tags',
      id: String(tag.id),
      document: {
        id: tag.id,
        name: tag.name,
      },
    });
  }

  async searchPosts(query: string, page: number, take: number): Promise<IPaginatedData<unknown>> {
    const from = (page - 1) * take;
    const result = await this.esService.search({
      index: 'posts',
      from,
      size: take,
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'content'],
          fuzziness: 'AUTO',
        },
      },
    });

    const hits = result.hits?.hits ?? [];
    const rawTotal = result.hits?.total;
    const total = typeof rawTotal === 'object' ? rawTotal.value : (rawTotal ?? 0);

    return {
      items: hits.map((h) => ({
        postId: (h._source as Record<string, unknown>).id as number,
        title: (h._source as Record<string, unknown>).title as string,
        content: (h._source as Record<string, unknown>).content as string | undefined,
        userId: (h._source as Record<string, unknown>).userId as number,
        score: h._score,
      })),
      meta: { total, page, lastPage: Math.ceil(total / take), take },
    };
  }

  async searchUsers(query: string, page: number, take: number): Promise<IPaginatedData<unknown>> {
    const from = (page - 1) * take;
    const result = await this.esService.search({
      index: 'users',
      from,
      size: take,
      query: {
        bool: {
          should: [
            { match: { username: { query, boost: 3 } } },
            { match: { displayName: { query, boost: 2 } } },
            { prefix: { username: { value: query } } },
          ],
        },
      },
    });

    const hits = result.hits?.hits ?? [];
    const rawTotal = result.hits?.total;
    const total = typeof rawTotal === 'object' ? rawTotal.value : (rawTotal ?? 0);

    return {
      items: hits.map((h) => ({
        userId: (h._source as Record<string, unknown>).id as number,
        username: (h._source as Record<string, unknown>).username as string,
        displayName: (h._source as Record<string, unknown>).displayName as string | undefined,
        score: h._score,
      })),
      meta: { total, page, lastPage: Math.ceil(total / take), take },
    };
  }

  async searchTags(query: string, page: number, take: number): Promise<IPaginatedData<unknown>> {
    const from = (page - 1) * take;
    const result = await this.esService.search({
      index: 'tags',
      from,
      size: take,
      query: {
        prefix: { name: query },
      },
    });

    const hits = result.hits?.hits ?? [];
    const rawTotal = result.hits?.total;
    const total = typeof rawTotal === 'object' ? rawTotal.value : (rawTotal ?? 0);

    return {
      items: hits.map((h) => ({
        id: (h._source as Record<string, unknown>).id as number,
        name: (h._source as Record<string, unknown>).name as string,
        score: h._score,
      })),
      meta: { total, page, lastPage: Math.ceil(total / take), take },
    };
  }
}
