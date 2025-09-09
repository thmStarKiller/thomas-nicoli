"use client";
import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import {LanguageSwitcher} from './LanguageSwitcher';

export function Header() {
  const tNav = useTranslations('nav');
  const locale = (useLocale() as 'en' | 'es') || 'es';
  const base = `/${locale}`;
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white rounded px-3 py-1 text-sm border border-slate-300">Skip to content</a>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href={base} className="font-semibold tracking-tight text-slate-900">
          Thomas Nicoli
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href={`${base}/services`} className="hover:text-slate-900 text-slate-600">
            {tNav('services')}
          </Link>
          <Link href={`${base}/work`} className="hover:text-slate-900 text-slate-600">
            {tNav('work')}
          </Link>
          <Link href={`${base}/about`} className="hover:text-slate-900 text-slate-600">
            {tNav('about')}
          </Link>
          <Link href={`${base}/contact`} className="hover:text-slate-900 text-slate-600">
            {tNav('contact')}
          </Link>
          <Link href={`${base}/chat`} className="hover:text-slate-900 text-slate-600">
            {tNav('chat')}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={`${base}/contact`}
            className="rounded-full bg-[#19C7C9] text-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow transition-shadow"
          >
            {tNav('contact')}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
