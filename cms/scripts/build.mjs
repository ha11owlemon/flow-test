import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const packageRoot = path.dirname(path.dirname(require.resolve('@sveltia/cms')));
const destination = path.join(root, 'dist');
await fs.mkdir(destination, {recursive: true});
await fs.cp(path.join(root, 'public'), destination, {recursive: true});
await fs.mkdir(path.join(destination, 'vendor'), {recursive: true});
await fs.copyFile(path.join(packageRoot, 'dist/sveltia-cms.js'), path.join(destination, 'vendor/sveltia-cms.js'));
await fs.copyFile(path.join(packageRoot, 'LICENSE.txt'), path.join(destination, 'vendor/LICENSE.txt'));
await fs.cp(path.join(packageRoot, 'dist/chunks'), path.join(destination, 'vendor/chunks'), {
  recursive: true,
  filter: source => !source.endsWith('.map'),
});

if (process.env.CMS_AUTH_URL) {
  const authUrl = new URL(process.env.CMS_AUTH_URL);
  if (authUrl.protocol !== 'https:') throw new Error('CMS_AUTH_URL for deployment must use HTTPS.');
  const configPath = path.join(destination, 'config.yml');
  const config = await fs.readFile(configPath, 'utf8');
  await fs.writeFile(configPath, config.replace(/^  base_url:.*$/m, `  base_url: ${JSON.stringify(authUrl.href.replace(/\/$/, ''))}`));
}
console.log('Standalone CMS built in cms/dist; it is excluded from the Docusaurus site.');
