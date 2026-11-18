export const propertyOptions = [
  ['apartment', 'Квартира'],
  ['house', 'Дом'],
  ['commercial', 'Коммерческое пространство'],
  ['other', 'Другое']
] as const;

export type InquiryDraft = Record<'name' | 'phone' | 'email' | 'property' | 'area' | 'comment', string>;
export type InquiryErrors = Partial<Record<keyof InquiryDraft, string>>;
type Inquiry = Omit<InquiryDraft, 'area'> & { area: number | null };
type Validation = { ok: true; data: Inquiry } | { ok: false; errors: InquiryErrors };

export function validateInquiry(input: unknown): Validation {
  const fields = typeof input === 'object' && input !== null ? input as Record<string, unknown> : {};
  const value = (key: keyof InquiryDraft) => typeof fields[key] === 'string' ? fields[key].trim() : '';
  const name = value('name');
  const phone = value('phone');
  const email = value('email');
  const property = value('property');
  const areaInput = value('area');
  const area = areaInput ? Number(areaInput.replace(',', '.')) : null;
  const comment = value('comment');
  const errors: InquiryErrors = {};

  if (name.length < 2 || name.length > 100) errors.name = 'Укажите имя от 2 до 100 символов.';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Укажите действительный email.';
  if (phone && (!/^\+?[\d ()-]{7,30}$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, '')))) {
    errors.phone = 'Проверьте номер телефона.';
  }
  if (!propertyOptions.some(([key]) => key === property)) errors.property = 'Выберите тип объекта.';
  if (area !== null && (!/^\d+(?:[.,]\d+)?$/.test(areaInput) || area <= 0 || area > 100000)) {
    errors.area = 'Укажите площадь от 0 до 100 000 м².';
  }
  if (comment.length < 5 || comment.length > 2000) errors.comment = 'Напишите от 5 до 2000 символов о проекте.';

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data: { name, phone, email, property, area, comment } };
}

const maxBodyBytes = 16 * 1024;

export async function readInquiry(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > maxBodyBytes) throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return JSON.parse(body + decoder.decode());
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel();
        throw new RangeError();
      }
      body += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

type Webhook = { url?: string; token?: string };

export function webhookTarget(url?: string): URL | undefined {
  if (!url) return;
  try {
    const target = new URL(url);
    if (target.protocol === 'https:' && !target.username && !target.password) return target;
  } catch {
    return;
  }
}

export async function deliverInquiry(inquiry: Inquiry, webhook: Webhook, send = fetch) {
  const target = webhookTarget(webhook.url);
  if (!target) return 'unavailable';

  try {
    const response = await send(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhook.token ? { Authorization: `Bearer ${webhook.token}` } : {})
      },
      body: JSON.stringify(inquiry),
      redirect: 'error',
      signal: AbortSignal.timeout(8000)
    });
    await response.body?.cancel();
    return response.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}
