export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';
// Lightweight re-exports to keep components decoupled
export {default as Link} from 'next/link';
export {redirect, usePathname, useRouter} from 'next/navigation';
