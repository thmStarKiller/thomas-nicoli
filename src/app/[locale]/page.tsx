'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {motion} from 'framer-motion';

export default function Home() {
  const tHero = useTranslations('hero');
  const tHome = useTranslations('home');
  const tServices = useTranslations('services');
  const tWork = useTranslations('work');

  return (
    <div className="">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="font-[family:var(--font-space)] text-4xl md:text-5xl font-bold tracking-tight">
              {tHero('title')}
            </motion.h1>
            <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.1}} className="mt-4 text-slate-600 text-lg">
              {tHero('subtitle')}
            </motion.p>
            <div className="mt-6 flex gap-3">
              <Link href="./contact" className="rounded-full bg-[#19C7C9] text-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow transition-shadow">
                {tHero('ctaPrimary')}
              </Link>
              <Link href="./chat" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-100">
                {tHero('ctaSecondary')}
              </Link>
            </div>
            <div className="mt-8">
              <img src="/images/placeholders/logo-strip.svg" alt="Client logos placeholder" className="w-full h-auto" />
            </div>
          </div>
          <div className="relative">
            <img src="/images/placeholders/hero-portrait.svg" alt="Thomas portrait placeholder" className="w-full h-auto" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">{tHome('servicesTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({length: 6}).map((_, i) => (
            <motion.div key={i} whileHover={{y: -4}} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="font-medium">{tServices(`items.${i}.title`)}</h3>
              <p className="mt-1 text-sm text-slate-600">{tServices(`items.${i}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">{tHome('workTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n, i) => (
              <motion.div key={n} whileHover={{y: -4}} className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
                <img src={`/images/placeholders/case-${n}.svg`} alt="Case study placeholder" className="w-full" />
                <div className="p-4">
                  <h3 className="font-medium">{tWork(`tiles.${i}.title`)}</h3>
                  <p className="text-sm text-slate-600">{tWork(`tiles.${i}.result`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{tHome('aboutTitle')}</h2>
          <p className="text-slate-600">L’Oréal DEC (Madrid), 10+ yrs digital/e‑comm, SFCC/SFMC, RAG, audits, automation.</p>
        </div>
        <div>
          <img src="/images/placeholders/about-portrait.svg" alt="About portrait" />
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{tHome('chatTitle')}</h2>
            <p className="text-slate-600">Interview Thomas about services, pricing and timelines.</p>
            <div className="mt-4">
              <Link href="./chat" className="rounded-full bg-[#19C7C9] text-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow transition-shadow">
                Go to chat
              </Link>
            </div>
          </div>
          <div>
            <img src="/images/placeholders/chatbot-illustration.svg" alt="Chatbot illustration" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold">{tHome('contactStrip')}</h2>
        <div className="mt-4">
          <Link href="./contact" className="rounded-full bg-[#19C7C9] text-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow transition-shadow">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}

