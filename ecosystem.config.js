const dotenv = require('dotenv');
const { error } = require('node:console');
const path = require('node:path');
const fs = require('node:fs');

const folderPath = './apps';

const services = fs
  .readdirSync(folderPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

if (!services.length) {
  console.warn('No services to start');
  process.exit(1);
}

module.exports = {
  apps: services.map((service) => ({
    name: service,
    script: 'nest',
    args: `start ${service} --watch`,
    env: {
      SERVICE: service,
      NODE_ENV: 'development',
    },
  })),
};
