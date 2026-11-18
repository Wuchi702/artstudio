import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateInquiry, readInquiry, deliverInquiry } from '../lib/inquiry.ts';

const draft = {
  name: '  Анна ', email: 'anna@example.com', phone: '+7 (900) 123-45-67',
  property: 'apartment', area: '85,5', comment: 'Нужен проект для новой квартиры.'
};
test('normalizes an inquiry and strips arbitrary fields', () => {
  const result = validateInquiry({ ...draft, unknown: 'discard' });
  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'Анна');
  assert.equal(result.data.area, 85.5);
  assert.equal(Object.hasOwn(result.data, 'unknown'), false);
});

test('rejects partial, unsupported and oversized fields', () => {
  const result = validateInquiry({ ...draft, name: '', property: 'invalid', area: '-5', email: '', phone: '000', comment: 'x'.repeat(3000) });
  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ['area', 'comment', 'email', 'name', 'phone', 'property']);
  assert.equal(validateInquiry(null).ok, false);
});

test('allows optional phone and area', () => {
  const result = validateInquiry({ ...draft, phone: '', area: '' });
  assert.equal(result.ok, true);
  assert.equal(result.data.area, null);
});

test('limits request size even in the absence of Content-Length', async () => {
  const request = new Request('https://example.com', { method: 'POST', body: 'x'.repeat(17000) });
  await assert.rejects(readInquiry(request), RangeError);
});

test('requires downstream HTTP confirmation and rejects redirects', async () => {
  const { data } = validateInquiry(draft);
  const stub = (status) => async (_url, options) => {
    assert.equal(options.redirect, 'error');
    assert.deepEqual(JSON.parse(options.body), data);
    return new Response(null, { status });
  };
  assert.equal(await deliverInquiry(data, { url: 'https://example.com/forms' }, stub(201)), 'sent');
  assert.equal(await deliverInquiry(data, { url: 'https://example.com/forms' }, stub(500)), 'failed');
  assert.equal(await deliverInquiry(data, { url: 'http://example.com/forms' }, stub(200)), 'unavailable');
  assert.equal(await deliverInquiry(data, {}, stub(200)), 'unavailable');
  assert.equal(await deliverInquiry(data, { url: 'https://example.com/forms' }, async () => { throw new Error('timeout'); }), 'failed');
});
