import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const distDirectory = join(projectRoot, 'dist');
const serverDirectory = join(distDirectory, 'server');
const hostingDirectory = join(distDirectory, '.openai');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'server' || entry.name === '.openai') continue;

    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath)));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

const files = await collectFiles(distDirectory);
const assets = {};

for (const file of files) {
  const route = `/${relative(distDirectory, file).split(sep).join('/')}`;
  const extension = extname(file).toLowerCase();
  assets[route] = {
    body: (await readFile(file)).toString('base64'),
    contentType: contentTypes[extension] ?? 'application/octet-stream',
  };
}

const workerSource = `const assets = ${JSON.stringify(assets)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const asset = assets[requestedPath] ?? assets['/index.html'];

    return new Response(decodeBase64(asset.body), {
      headers: {
        'cache-control': requestedPath === '/index.html'
          ? 'no-cache'
          : 'public, max-age=31536000, immutable',
        'content-type': asset.contentType,
      },
    });
  },
};
`;

await mkdir(serverDirectory, { recursive: true });
await mkdir(hostingDirectory, { recursive: true });
await writeFile(join(serverDirectory, 'index.js'), workerSource);
await copyFile(
  join(projectRoot, '.openai', 'hosting.json'),
  join(hostingDirectory, 'hosting.json'),
);
