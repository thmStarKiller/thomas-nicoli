"use client";
import {useTranslations} from 'next-intl';
import {useState} from 'react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle'|'ok'|'error'|'loading'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('loading');
    try {
      const res = await fetch('/api/lead', {method: 'POST', body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company || '',
        website: data.website || '',
        message: data.message,
        consent: data.consent === 'on'
      }), headers: { 'Content-Type': 'application/json' }});
      if (res.ok) setStatus('ok'); else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">{t('name')}</label>
          <input id="name" name="name" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">{t('email')}</label>
          <input id="email" type="email" name="email" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="company">{t('company')}</label>
            <input id="company" name="company" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="website">{t('website')}</label>
            <input id="website" name="website" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="message">{t('message')}</label>
          <textarea id="message" name="message" required rows={5} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input type="checkbox" name="consent" required className="mt-1" />
          <span>{t('consent')}</span>
        </label>
        <div>
          <button disabled={status==='loading'} className="rounded-full bg-[#19C7C9] text-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow transition-shadow">
            {status==='loading' ? '…' : t('submit')}
          </button>
        </div>
        {status==='ok' && <p className="text-green-700">{t('thanks')}</p>}
        {status==='error' && <p className="text-red-700">{t('error')}</p>}
      </form>
    </div>
  );
}

