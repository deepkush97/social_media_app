import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { UserCreateEventPayload } from '@app/shared/events/user-created.event';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { PostSource } from '@app/shared/interfaces/search/post-source.interface';
import { ISearchPostHit } from '@app/shared/interfaces/search/search-post-hit.interface';
import { ISearchTagHit } from '@app/shared/interfaces/search/search-tag-hit.interface';
import { ISearchUserHit } from '@app/shared/interfaces/search/search-user-hit.interface';
import { TagSource } from '@app/shared/interfaces/search/tag-source.interface';
import { UserSource } from '@app/shared/interfaces/search/user-source.interface';

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly logger: AppLoggerService,
  ) {}

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
    try {
      const exists = await this.esService.indices.exists({ index: name });
      if (!exists) {
        await this.esService.indices.create({ index: name, ...spec });
      }
    } catch (err) {
      this.logger.error(`Failed to ensure index ${name}`, { context: 'SearchService', error: err });
      throw err;
    }
  }

  async indexPost(post: PostCreatedEventPayload & { tags: string[] }): Promise<void> {
    try {
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
    } catch (err) {
      this.logger.error(`Failed to index post ${post.id}`, {
        context: 'SearchService',
        error: err,
      });
      throw err;
    }
  }

  async indexUser(document: UserCreateEventPayload): Promise<void> {
    try {
      await this.esService.index({
        index: 'users',
        id: String(document.id),
        document,
      });
    } catch (err) {
      this.logger.error(`Failed to index user ${document.id}`, {
        context: 'SearchService',
        error: err,
      });
      throw err;
    }
  }

  async indexTag(name: string): Promise<void> {
    try {
      await this.esService.index({
        index: 'tags',
        id: name,
        document: { name },
      });
    } catch (err) {
      this.logger.error(`Failed to index tag ${name}`, { context: 'SearchService', error: err });
      throw err;
    }
  }

  async bulkIndexTags(tagNames: string[]): Promise<void> {
    if (tagNames.length === 0) return;

    try {
      await this.esService.bulk({
        operations: tagNames.flatMap((name) => [
          { index: { _index: 'tags', _id: name } },
          { name },
        ]),
      });
    } catch (err) {
      this.logger.error('Failed to bulk index tags', { context: 'SearchService', error: err });
      throw err;
    }
  }

  async searchPosts(
    query: string,
    page: number,
    take: number,
  ): Promise<IPaginatedData<ISearchPostHit>> {
    try {
      const from = (page - 1) * take;
      const result = await this.esService.search<PostSource>({
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
        items: hits.map((h) => {
          const { id, title, content, tags, userId } = h._source;
          return {
            id,
            title,
            content,
            tags,
            userId,
            score: h._score,
          };
        }),
        meta: { total, page, lastPage: Math.ceil(total / take), take },
      };
    } catch (err) {
      this.logger.error('searchPosts failed', {
        context: 'SearchService',
        error: err,
        data: { query, page, take },
      });
      throw err;
    }
  }

  async searchUsers(
    query: string,
    page: number,
    take: number,
  ): Promise<IPaginatedData<ISearchUserHit>> {
    try {
      const from = (page - 1) * take;
      const result = await this.esService.search<UserSource>({
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
        items: hits.map((h) => {
          const { id, email, name } = h._source;
          return {
            id,
            email,
            name,
            score: h._score,
          };
        }),
        meta: { total, page, lastPage: Math.ceil(total / take), take },
      };
    } catch (err) {
      this.logger.error('searchUsers failed', {
        context: 'SearchService',
        error: err,
        data: { query, page, take },
      });
      throw err;
    }
  }

  async searchTags(
    query: string,
    page: number,
    take: number,
  ): Promise<IPaginatedData<ISearchTagHit>> {
    try {
      const from = (page - 1) * take;
      const result = await this.esService.search<TagSource>({
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
        items: hits.map((h) => {
          const { name } = h._source;
          return {
            id: h._id,
            name,
            score: h._score,
          };
        }),
        meta: { total, page, lastPage: Math.ceil(total / take), take },
      };
    } catch (err) {
      this.logger.error('searchTags failed', {
        context: 'SearchService',
        error: err,
        data: { query, page, take },
      });
      throw err;
    }
  }
}
