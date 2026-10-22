import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const root = fileURLToPath(new URL('../', import.meta.url));
const roots = ['src', 'server', 'scripts', 'public'];
const files = ['package.json', 'package-lock.json', 'README.md', '.gitignore', 'index.html', 'nse-openapi.json', 'vite.config.ts', 'vitest.config.ts', 'postcss.config.js', 'tailwind.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'setup.cmd', 'start.cmd'];
const blocked = new Set(['node_modules', 'dist', '.git', '.swc-cache', 'coverage', 'share']);
function visit(relative) {
  for (const item of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    if (blocked.has(item.name) || item.name === '.env' || (item.name.startsWith('.env.') && item.name !== '.env.example') || item.name.endsWith('.log')) continue;
    const name = path.posix.join(relative, item.name);
    if (item.isDirectory()) visit(name);
    else if (item.isFile()) files.push(name);
  }
}
roots.forEach(visit);
files.sort();
// Create a portable ZIP using Node's standard library; no archiving dependency is needed.
const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(data) { let value = 0xffffffff; for (const byte of data) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8); return (value ^ 0xffffffff) >>> 0; }
const parts = [], directory = [];
let offset = 0;
for (const name of files) {
  const raw = fs.readFileSync(path.join(root, name));
  const compressed = deflateRawSync(raw);
  const entryName = Buffer.from('mutual-funds/' + name);
  const crc = crc32(raw);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6); header.writeUInt16LE(8, 8); header.writeUInt16LE(33, 12);
  header.writeUInt32LE(crc, 14); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(raw.length, 22); header.writeUInt16LE(entryName.length, 26);
  parts.push(header, entryName, compressed);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10); central.writeUInt16LE(33, 14);
  central.writeUInt32LE(crc, 16); central.writeUInt32LE(compressed.length, 20); central.writeUInt32LE(raw.length, 24); central.writeUInt16LE(entryName.length, 28); central.writeUInt32LE(offset, 42);
  directory.push(central, entryName); offset += header.length + entryName.length + compressed.length;
}
const central = Buffer.concat(directory);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(central.length, 12); end.writeUInt32LE(offset, 16);
const output = path.join(root, 'share');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'mutual-funds-standalone.zip'), Buffer.concat([...parts, central, end]));
fs.writeFileSync(path.join(output, 'file-list.json'), JSON.stringify(files, null, 2) + '\n');
console.log(`Created share/mutual-funds-standalone.zip with ${files.length} files. Local credentials and installed dependencies are excluded.`);
