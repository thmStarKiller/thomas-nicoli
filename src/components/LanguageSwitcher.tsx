"use client";
import {useLocale} from 'next-intl';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const other = locale === 'es' ? 'en' : 'es';

  function swapLocaleInPath(p: string, next: string) {
    const parts = (p || '/').split('/');
    if (parts.length < 2 || parts[1].length !== 2) {
      return `/${next}`;
    }
    parts[1] = next;
    return parts.join('/') || `/${next}`;
  }

  const nextHref = swapLocaleInPath(pathname || `/${locale}`, other);

  return (
    <Link
      href={nextHref}
      aria-label={other === 'es' ? 'Cambiar a español' : 'Switch to English'}
      className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {other.toUpperCase()}
    </Link>
  );
}
