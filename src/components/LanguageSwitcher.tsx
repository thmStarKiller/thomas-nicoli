"use client";
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const other = locale === 'es' ? 'en' : 'es';

  const handleLanguageSwitch = () => {
    // pathname from usePathname() already includes the locale
    // e.g., "/es/services" or "/en/about"
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const newPath = `/${other}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <button
      onClick={handleLanguageSwitch}
      aria-label={other === 'es' ? 'Cambiar a español' : 'Switch to English'}
      className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
    >
      {other.toUpperCase()}
    </button>
  );
}
