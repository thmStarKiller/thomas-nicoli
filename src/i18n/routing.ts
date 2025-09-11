export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

import {createNavigation} from 'next-intl/navigation';

export const {Link, usePathname, useRouter, redirect} = createNavigation({
  locales
});
