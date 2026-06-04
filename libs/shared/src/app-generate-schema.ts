// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';

import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
  RESOLVER_NAME_METADATA,
} from '@nestjs/graphql';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { printSchema } from 'graphql';

function resolveImportedModule(imp: unknown): Type<unknown> | null {
  if (typeof imp === 'function') {
    return imp as Type<unknown>;
  }
  if (imp && typeof imp === 'object') {
    const obj = imp as Record<string, unknown>;
    if (typeof obj.module === 'function') {
      return obj.module as Type<unknown>;
    }
    if (typeof obj.forwardRef === 'function') {
      const wrapped = obj.forwardRef();
      if (typeof wrapped === 'function') {
        return wrapped as Type<unknown>;
      }
    }
  }
  return null;
}

export function collectProvidersRecursively(
  module: Type<unknown>,
  seen: Set<Type<unknown>> = new Set(),
): Type<unknown>[] {
  if (seen.has(module)) {
    return [];
  }
  seen.add(module);

  const providers: unknown[] = Reflect.getMetadata('providers', module) ?? [];
  const imports: unknown[] = Reflect.getMetadata('imports', module) ?? [];

  const result: Type<unknown>[] = [];

  for (const provider of providers) {
    if (typeof provider === 'function') {
      const metadata = Reflect.getMetadataKeys(provider);
      if (metadata.includes(RESOLVER_NAME_METADATA)) {
        result.push(provider as Type<unknown>);
      }
    }
  }

  for (const imp of imports) {
    const resolved = resolveImportedModule(imp);
    if (resolved) {
      result.push(...collectProvidersRecursively(resolved, seen));
    }
  }

  return result;
}

export async function appGenerateSchema(module: Type<unknown>): Promise<void> {
  const resolvers = [...new Set(collectProvidersRecursively(module))];

  const serviceName = process.env.SERVICE;

  const app = await NestFactory.create(GraphQLSchemaBuilderModule, { logger: false });
  await app.init();
  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create(resolvers, []);
  const sdl = printSchema(schema);
  const schemaPath = join(process.cwd(), `libs/shared/src/graphql/schema/${serviceName}.graphql`);
  writeFileSync(schemaPath, sdl);
  await app.close();
}
