import {getRequestConfig} from 'next-intl/server';
import type {AbstractIntlMessages} from 'next-intl';

export default getRequestConfig(async ({locale}) => {
  const l: 'en' | 'es' = locale === 'en' || locale === 'es' ? (locale as 'en' | 'es') : 'es';
  const messages = (await import(`./${l}.json`)).default as AbstractIntlMessages;
  return {messages, locale: l};
});
