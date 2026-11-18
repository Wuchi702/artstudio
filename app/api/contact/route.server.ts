import { deliverInquiry, readInquiry, validateInquiry } from '@/lib/inquiry';
import { siteUrl } from '@/lib/site-url';

export async function POST(request: Request) {
  const publicOrigin = siteUrl()?.origin;
  const allowedOrigin = publicOrigin ?? new URL(request.url).origin;
  const origin = request.headers.get('origin');

  if (origin && origin !== allowedOrigin) {
    return Response.json({ state: 'forbidden' }, { status: 403 });
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return Response.json({ state: 'invalid' }, { status: 415 });
  }

  let payload: unknown;
  try {
    payload = await readInquiry(request);
  } catch (error) {
    return Response.json({ state: 'invalid' }, { status: error instanceof RangeError ? 413 : 400 });
  }
  const result = validateInquiry(payload);
  if (!result.ok) {
    return Response.json({ state: 'validation', errors: result.errors }, { status: 422 });
  }

  const state = await deliverInquiry(result.data, {
    url: publicOrigin ? process.env.CONTACT_WEBHOOK_URL : undefined,
    token: process.env.CONTACT_WEBHOOK_TOKEN
  });
  return Response.json({ state }, { status: state === 'sent' ? 201 : state === 'unavailable' ? 503 : 502 });
}
