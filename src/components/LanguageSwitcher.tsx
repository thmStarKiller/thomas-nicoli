"use client";
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const other = locale === 'es' ? 'en' : 'es';

  function swapLocaleInPath(p: string, next: string) {
    const parts = p.split('/');
    parts[1] = next; // replace locale segment
    return parts.join('/') || `/${next}`;
  }
  return (
    <button
      aria-label={other === 'es' ? 'Cambiar a español' : 'Switch to English'}
      onClick={() => router.replace(swapLocaleInPath(pathname, other))}
      className="rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
    >
      {other.toUpperCase()}
    </button>
  );
}
