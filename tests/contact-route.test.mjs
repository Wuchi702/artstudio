import assert from 'node:assert/strict';
import { test } from 'node:test';
import { POST } from '../app/api/contact/route.server.ts';

const request = (payload, origin = 'https://example.com', contentType = 'application/json') =>
  new Request('http://internal:3000/api/contact', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': contentType },
    body: payload
  });

const draft = {
  name: 'Анна', email: 'anna@example.com', phone: '',
  property: 'apartment', area: '42', comment: 'Планировка квартиры.'
};

test('public route confirms successful delivery, validates requests and handles downtime', async (t) => {
  const site = process.env.SITE_URL;
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const token = process.env.CONTACT_WEBHOOK_TOKEN;
  process.env.SITE_URL = 'https://example.com';
  process.env.CONTACT_WEBHOOK_URL = 'https://forms.example.com/inquiries';
  process.env.CONTACT_WEBHOOK_TOKEN = 'test-token';

  t.after(() => {
    for (const [key, value] of Object.entries({ SITE_URL: site, CONTACT_WEBHOOK_URL: webhook, CONTACT_WEBHOOK_TOKEN: token })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  let webhookStatus = 201;
  const deliveries = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(String(url), 'https://forms.example.com/inquiries');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.deepEqual(JSON.parse(options.body), { ...draft, area: 42 });
    return new Response(null, { status: webhookStatus });
  });
  const body = JSON.stringify(draft);
  assert.equal((await POST(request(body, 'https://different.example'))).status, 403);
  assert.equal((await POST(request(body, 'https://example.com', 'text/plain'))).status, 415);
  assert.equal((await POST(request('{'))).status, 400);
  assert.equal((await POST(request('x'.repeat(17000)))).status, 413);

  const invalid = await POST(request('{}'));
  assert.equal(invalid.status, 422);
  assert.equal((await invalid.json()).state, 'validation');
  assert.equal(deliveries.mock.callCount(), 0);

  const valid = await POST(request(body));
  assert.equal(valid.status, 201);
  assert.deepEqual(await valid.json(), { state: 'sent' });

  webhookStatus = 503;
  assert.equal((await POST(request(body))).status, 502);
  delete process.env.CONTACT_WEBHOOK_URL;
  const unavailable = await POST(request(body));
  assert.equal(unavailable.status, 503);
  assert.deepEqual(await unavailable.json(), { state: 'unavailable' });
  assert.equal(deliveries.mock.callCount(), 2);
});
