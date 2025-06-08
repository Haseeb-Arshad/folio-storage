import { existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '..', 'dist');

if (existsSync(distPath)) {
  console.log('Cleaning up dist directory...');
  rmSync(distPath, { recursive: true, force: true });
  console.log('Cleanup complete!');
} else {
  console.log('Dist directory does not exist. Nothing to clean.');
}
