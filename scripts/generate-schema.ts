/* eslint-disable no-console */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import * as path from 'node:path';

import * as yaml from 'yaml';

const GRAPHQL_FOLDER = `libs/shared/src/graphql/schema`;
const CLIENT_FOLDER = `libs/shared/src/graphql/client`;
const SUPERGRAPH_FILE = `${GRAPHQL_FOLDER}/supergraph.graphql`;
const ROUTER_CONFIG_FILE = `router/supergraph-config.yaml`;

async function run(): Promise<void> {
  const allEnvs = Object.keys(process.env);

  const subgraphs = {};
  for (const envKey of allEnvs) {
    if (!envKey.endsWith('_GRAPHQL_URL')) continue;

    const service = envKey.replace('_GRAPHQL_URL', '').toLowerCase();

    console.log(`Building schema for: ${service}`);

    execSync(`GENERATE_SCHEMA=true SERVICE=${service} npx nest start ${service}`, {
      stdio: 'inherit',
    });

    subgraphs[service] = {
      routing_url: process.env[envKey],
      schema: {
        file: path.join(process.cwd(), GRAPHQL_FOLDER, `/${service}.graphql`),
      },
    };
  }

  const superGraphConfig = {
    federation_version: '=2.3.2',
    subgraphs,
  };

  writeFileSync(ROUTER_CONFIG_FILE, yaml.stringify(superGraphConfig));

  console.log('Generating supergraph');
  execSync(
    `APOLLO_ELV2_LICENSE=accept npx rover supergraph compose --config ${ROUTER_CONFIG_FILE} > ${SUPERGRAPH_FILE}`,
    {
      stdio: 'inherit',
    },
  );

  try {
    execSync(`npx genql --schema ${SUPERGRAPH_FILE} --output ${CLIENT_FOLDER} --typescript`, {
      stdio: 'inherit',
    });
    console.log(`client generated successfully at ${CLIENT_FOLDER}`);
  } catch (error) {
    console.error('error while generating the client', error.message);
  }
}

void run();
