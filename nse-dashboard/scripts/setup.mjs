import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const major = Number(process.versions.node.split('.')[0]);
if (major < 22 || major === 22 && Number(process.versions.node.split('.')[1]) < 12) { console.error('Install Node.js 22.12 or later before setup.'); process.exit(1); }
for (const cwd of [root, fileURLToPath(new URL('../server/', import.meta.url))]) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(command, ['ci', '--no-audit', '--no-fund'], { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) { console.error(result.error.message); process.exit(1); }
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log('\nSetup complete. Run npm start to open the app.');
