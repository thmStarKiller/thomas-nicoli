import {useTranslations} from 'next-intl';

export const dynamic = 'force-static';

export default function WorkPage() {
  const t = useTranslations('work');
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
            <img src={`/images/placeholders/case-${n}.svg`} alt="Case study placeholder" className="w-full" />
            <div className="p-4">
              <h3 className="font-medium">{t(`tiles.${i}.title`)}</h3>
              <p className="text-sm text-slate-600">{t(`tiles.${i}.result`)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

