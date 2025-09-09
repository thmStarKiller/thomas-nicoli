import Link from 'next/link';
import {useTranslations} from 'next-intl';

export function Footer({locale}: {locale: string}) {
  const t = useTranslations('legal');
  const base = `/${locale}`;
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Thomas Nicoli</p>
        <nav className="flex gap-6">
          <Link href={`${base}/privacy`} className="hover:text-slate-900">
            {t('privacy')}
          </Link>
          <Link href={`${base}/terms`} className="hover:text-slate-900">
            {t('terms')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
