import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const basePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? '';
const origin = new URL(process.env.SITE_URL ?? 'https://example.com');
const output = 'out';
const files = readdirSync(output, { recursive: true }).filter((file) => file.endsWith('/index.html') || file === 'index.html');
const expected = [
  'index.html', 'about/index.html', 'contact/index.html', 'services/index.html',
  'projects/index.html', 'projects/dom-tihogo-sveta/index.html', 'projects/ton-duba/index.html',
  'projects/v-storonu-sada/index.html'
];

for (const file of expected) {
  assert.ok(files.includes(file), `Missing ${file}`);
  const html = readFileSync(join(output, file), 'utf8');
  const canonical = new URL(`${basePath}/${file.replace(/index\.html$/, '')}`, origin);
  assert.ok(html.includes(`rel="canonical" href="${canonical.href}"`), `Incorrect canonical in ${file}`);

  const attributes = html.matchAll(/<(?:a|img|script|source|link)\b(?!(?:[^>]*\brel="preconnect"))[^>]*?\s(?:href|src|srcset)="([^"]+)"/g);
  for (const [, value] of attributes) {
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const url = new URL(value, origin);
    assert.ok(url.pathname.startsWith(`${basePath}/`), `Missing Pages base path in ${file}: ${value}`);
    const localPath = decodeURIComponent(url.pathname.slice(basePath.length + 1));
    const target = url.pathname.endsWith('/') ? join(output, localPath, 'index.html') : join(output, localPath);
    assert.ok(existsSync(target), `Missing asset or route in ${file}: ${target}`);
  }
}

assert.ok(!existsSync(join(output, 'api', 'contact')));
assert.match(readFileSync(join(output, 'contact', 'index.html'), 'utf8'), /id="form-unavailable"/);
console.log(`Pages export checked: ${expected.length} routes, canonical URLs, asset paths and inactive contact form.`);
