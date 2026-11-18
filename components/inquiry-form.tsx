'use client';

import { useRef, useState, type FormEvent, type InputHTMLAttributes } from 'react';
import { propertyOptions, validateInquiry, type InquiryDraft, type InquiryErrors } from '@/lib/inquiry';
import { Arrow } from './ui';

type Field = { key: keyof InquiryDraft; label: string } & Pick<InputHTMLAttributes<HTMLInputElement>, 'type' | 'autoComplete' | 'maxLength' | 'required' | 'inputMode'>;

const fields: Field[] = [
  { key: 'name', label: 'Имя', type: 'text', autoComplete: 'name', maxLength: 100, required: true },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', maxLength: 254, required: true },
  { key: 'phone', label: 'Телефон', type: 'tel', autoComplete: 'tel', maxLength: 30 },
  { key: 'property', label: 'Тип объекта', required: true },
  { key: 'area', label: 'Площадь, м²', type: 'text', inputMode: 'decimal', maxLength: 12 },
  { key: 'comment', label: 'Расскажите о вашем проекте', maxLength: 2000, required: true }
];

type State = 'idle' | 'sending' | 'sent' | 'unavailable' | 'failed';

export function InquiryForm({ available, service }: { available: boolean; service?: string }) {
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [state, setState] = useState<State>('idle');
  const submitting = useRef(false);

  function reportErrors(form: HTMLFormElement, errors: InquiryErrors) {
    setErrors(errors);
    const first = fields.find(({ key }) => errors[key]);
    if (first) {
      const input = form.elements.namedItem(first.key) as HTMLElement | null;
      requestAnimationFrame(() => input?.focus());
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || submitting.current) return;

    const form = event.currentTarget;
    const draft = Object.fromEntries(new FormData(form)) as InquiryDraft;
    const result = validateInquiry(draft);
    if (!result.ok) {
      setState('idle');
      reportErrors(form, result.errors);
      return;
    }

    submitting.current = true;
    setState('sending');
    setErrors({});
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
        signal: AbortSignal.timeout(12000)
      });
      const payload = await response.json();
      if (response.status === 201 && payload.state === 'sent') {
        form.reset();
        setState('sent');
      } else if (response.status === 422 && payload.errors) {
        setState('idle');
        reportErrors(form, payload.errors);
      } else {
        setState(response.status === 503 ? 'unavailable' : 'failed');
      }
    } catch {
      setState('failed');
    } finally {
      submitting.current = false;
    }
  }

  const message = {
    idle: '',
    sending: 'Отправляем заявку…',
    sent: 'Заявка получена.',
    unavailable: 'Приём заявок временно недоступен.',
    failed: 'Подтверждение отправки не получено. Попробуйте ещё раз позже.'
  }[state];

  return <form className="inquiry-form" onSubmit={submit} method="post" action="/api/contact" noValidate
    aria-label="Заявка на дизайн-проект" aria-describedby={!available ? 'form-unavailable' : undefined} aria-busy={state === 'sending'}>
    {available && <noscript><p className="field-error">Для отправки заявки включите JavaScript.</p></noscript>}
    <fieldset disabled={!available || state === 'sending'}>
      <legend className="visually-hidden">Данные проекта</legend>
      <div className="form-fields">
        {fields.map(({ key, label, ...options }) => {
          const error = errors[key];
          const control = {
            id: `inquiry-${key}`,
            name: key,
            required: options.required,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `error-${key}` : undefined
          };

          return <div className={`form-field field-${key}`} key={key}>
            <label htmlFor={control.id}>{label}{options.required && <span aria-hidden="true"> *</span>}</label>
            {key === 'property' ? <select {...control} defaultValue="">
              <option value="" disabled>Выберите тип</option>
              {propertyOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select> : key === 'comment' ? <textarea {...control} rows={4} maxLength={options.maxLength}
              defaultValue={service ? `Интересует формат «${service}».\n` : undefined} />
              : <input {...control} {...options} />}
            {error && <span className="field-error" id={`error-${key}`}>{error}</span>}
          </div>;
        })}
      </div>
    </fieldset>
    <div className="form-bottom">
      <button className="form-submit" type="submit" disabled={!available || state === 'sending'}>Отправить заявку<Arrow /></button>
      {available && <p className="field-note">* Обязательные поля</p>}
    </div>
    <p className={`form-status ${state === 'failed' || state === 'unavailable' ? 'field-error' : ''}`} role="status">{message}</p>
  </form>;
}
