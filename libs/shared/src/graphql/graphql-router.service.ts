import { Inject, Injectable } from '@nestjs/common';

import { AsyncStore } from '../utils/async.store';

import { Client, createClient } from './client';
import { GRAPHQL_ROUTER_OPTIONS } from './graphql-router.definition';
import { GraphqlRouterModuleOptions } from './graphql-router.interface';

@Injectable()
export class GraphqlRouterService {
  public readonly client: Client;

  constructor(
    @Inject(GRAPHQL_ROUTER_OPTIONS) private readonly options: GraphqlRouterModuleOptions,
  ) {
    this.client = createClient({
      url: options.url,
      fetcher: async (operation) => {
        const data = AsyncStore.get();

        const response = await fetch(options.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-request-id': data?.requestId ?? 'null',
          },
          body: JSON.stringify(operation),
        });

        const text = await response.text();

        if (!response.ok) {
          throw new Error(
            `GraphQL router fetch failed: ${response.status} ${response.statusText} — ${text}`,
          );
        }

        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`GraphQL router returned non-JSON response: ${text}`);
        }
      },
    });
  }
}
