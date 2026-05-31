import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { UserCreateEventPayload } from '@app/shared/events/user-created.event';
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
          tags: { type: 'keyword' },
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
          email: {
            type: 'text',
            analyzer: 'autocomplete',
            fields: { raw: { type: 'keyword' } },
          },
          name: {
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

  async indexPost(post: PostCreatedEventPayload & { tags: string[] }): Promise<void> {
    await this.esService.index({
      index: 'posts',
      id: String(post.id),
      document: {
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        userId: post.userId,
        createdAt: post.createdAt ?? new Date().toISOString(),
      },
    });
  }

  async indexUser(document: UserCreateEventPayload): Promise<void> {
    await this.esService.index({
      index: 'users',
      id: String(document.id),
      document,
    });
  }

  async indexTag(name: string): Promise<void> {
    await this.esService.index({
      index: 'tags',
      id: name,
      document: { name },
    });
  }

  async bulkIndexTags(tagNames: string[]): Promise<void> {
    if (tagNames.length === 0) return;

    await this.esService.bulk({
      operations: tagNames.flatMap((name) => [{ index: { _index: 'tags', _id: name } }, { name }]),
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
        tags: (h._source as Record<string, unknown>).tags as string[] | undefined,
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
            { match: { email: { query, boost: 3 } } },
            { match: { name: { query, boost: 2 } } },
            { prefix: { email: { value: query } } },
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
        email: (h._source as Record<string, unknown>).email as string,
        name: (h._source as Record<string, unknown>).name as string | undefined,
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
        id: h._id,
        name: (h._source as Record<string, unknown>).name as string,
        score: h._score,
      })),
      meta: { total, page, lastPage: Math.ceil(total / take), take },
    };
  }
}
