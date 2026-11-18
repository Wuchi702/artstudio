import assert from 'node:assert/strict';

const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:3000');
const pages = [
  '/', '/projects', '/projects/dom-tihogo-sveta', '/projects/ton-duba',
  '/projects/v-storonu-sada', '/about', '/services', '/contact'
];
const descendants = new Map();
const resources = new Set();

function sameOrigin(value, path) {
  const url = new URL(value.replaceAll('&amp;', '&'), new URL(path, origin));
  return url.origin === origin.origin ? url : null;
}

for (const path of pages) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<html lang="ru"/);
  assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length, 1, path);
  if (path.startsWith('/projects/')) assert.match(html, /Интерьерная визуализация/);
  descendants.set(path, html);

  const matches = html.matchAll(/<(?:script|link|img)\b[^>]*?\s(?:href|src)="([^"]+)"/g);
  for (const [, value] of matches) {
    const url = sameOrigin(value, path);
    if (url?.pathname.startsWith('/_next/') || url?.pathname === '/icon.svg') resources.add(url.href);
  }
}

for (const [path, html] of descendants) {
  for (const [, value] of html.matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)) {
    const url = sameOrigin(value, path);
    if (!url) continue;
    const target = descendants.get(url.pathname);
    assert.ok(target, `Broken internal link from ${path}: ${value}`);
    if (url.hash) assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Broken anchor: ${value}`);
  }
}

for (const path of ['hero', 'hero-mobile', 'light', 'oak', 'oak-detail', 'garden', 'threshold', 'detail', 'atelier']) {
  const url = new URL('/_next/image', origin);
  url.search = new URLSearchParams({ url: `/images/${path}.webp`, w: '390', q: '85' }).toString();
  resources.add(url.href);
}

const assetTypes = { fonts: 0, optimizedImages: 0 };
for (const address of resources) {
  const response = await fetch(address, { headers: { Accept: 'image/webp,*/*' } });
  assert.equal(response.status, 200, address);
  if (address.includes('/_next/image?')) {
    assert.match(response.headers.get('content-type'), /^image\//, address);
    assetTypes.optimizedImages++;
  }
  if (address.endsWith('.css')) {
    const css = await response.text();
    for (const [, value] of css.matchAll(/url\(["']?([^\s)'"]+\.woff2)["']?\)/g)) {
      const font = await fetch(new URL(value, address));
      assert.equal(font.status, 200, value);
      await font.body?.cancel();
      assetTypes.fonts++;
    }
  } else {
    await response.body?.cancel();
  }
}
assert.ok(assetTypes.fonts > 0);

for (const [path, status] of [['/projects/nonexistent', 404], ['/robots.txt', 200], ['/sitemap.xml', 200]]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, status, path);
  await response.body?.cancel();
}
const invalid = await fetch(new URL('/api/contact', origin), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}'
});
assert.equal(invalid.status, 422);
assert.equal((await invalid.json()).state, 'validation');

console.log(JSON.stringify({ pages: descendants.size, resources: resources.size, ...assetTypes, brokenLinks: 0, routeValidation: 422 }));
