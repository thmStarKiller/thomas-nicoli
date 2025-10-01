'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowRight, Sparkles, Zap, Target, Brain, Globe, MessageSquare } from 'lucide-react';

import { AuroraText } from '@/components/magicui/aurora-text';
import { BlurFade } from '@/components/magicui/blur-fade';
import ShimmerButton from '@/components/magicui/shimmer-button';
import { MagicCard } from '@/components/magicui/magic-card';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Particles } from '@/components/magicui/particles';
import ExplainerVideo from '@/components/ExplainerVideo';

export default function HomeContent() {
  const tHero = useTranslations('hero');
  const tHome = useTranslations('home');
  const tServices = useTranslations('services');
  const tWork = useTranslations('work');
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    setColor(resolvedTheme === 'dark' ? '#ffffff' : '#000000');
  }, [resolvedTheme]);

  const servicesData = tServices.raw('items') as Array<{ title: string; desc: string }>;
  const servicesTitle = tServices('title'); // Cache this explicitly

  const services = [
    { icon: <Brain className="w-6 h-6" />, title: servicesData[0]?.title, description: servicesData[0]?.desc },
    { icon: <Zap className="w-6 h-6" />, title: servicesData[1]?.title, description: servicesData[1]?.desc },
    { icon: <Target className="w-6 h-6" />, title: servicesData[2]?.title, description: servicesData[2]?.desc },
    { icon: <Globe className="w-6 h-6" />, title: servicesData[3]?.title, description: servicesData[3]?.desc },
    { icon: <MessageSquare className="w-6 h-6" />, title: servicesData[4]?.title, description: servicesData[4]?.desc },
    { icon: <Sparkles className="w-6 h-6" />, title: servicesData[5]?.title, description: servicesData[5]?.desc },
  ];

  return (
    <div key={locale} className="relative min-h-screen bg-background overflow-x-hidden">
      <Particles className="absolute inset-0 z-0" quantity={50} ease={80} color={color} refresh />

      <section className="relative z-10 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-32 md:py-40">
          <div className="text-center">
            <BlurFade delay={0.25} inView>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                {tHero('title').split(' ').slice(0, -3).join(' ')}
                <br />
                <AuroraText className="text-5xl md:text-7xl font-bold">
                  {tHero('title').split(' ').slice(-3).join(' ')}
                </AuroraText>
              </h1>
            </BlurFade>

            <BlurFade delay={0.35} inView>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                {tHero('subtitle')}
              </p>
            </BlurFade>

            <BlurFade delay={0.45} inView>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 px-4">
                <Link href={`/${locale}/contact`}>
                  <ShimmerButton
                    background="rgba(0, 0, 0, 1)"
                    shimmerColor="#ffffff"
                    className="text-white dark:text-white text-sm sm:text-base w-full sm:w-auto"
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      {tHero('ctaPrimary')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </ShimmerButton>
                </Link>

                <Link href={`/${locale}/chat`} className="group w-full sm:w-auto">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base py-2">
                    <MessageSquare className="w-4 h-4" />
                    {tHero('ctaSecondary')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </BlurFade>

            <BlurFade delay={0.55} inView>
              <div className="text-sm text-muted-foreground">
                {tHome('trustedBy')}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-background/80">
        <div className="mx-auto max-w-6xl px-4">
          <BlurFade delay={0.2} inView>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {servicesTitle} <AuroraText>{tHome('servicesSectionTitle')}</AuroraText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {tHome('servicesDescription')}
              </p>
            </div>
          </BlurFade>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => (
              <BlurFade key={service.title ?? index} delay={0.25 + index * 0.05} inView>
                <MagicCard className="group p-6 h-full border border-border bg-card text-left">
                  <div className="flex items-center gap-3 mb-4 text-primary">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <BlurFade delay={0.2} inView>
            <div className="rounded-3xl border border-border bg-card/80 p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {tHome('workSectionTitle')} <AuroraText>{tHome('workMetric')}</AuroraText>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">{tHome('workDescription')}</p>
                  <div className="grid gap-6">
                    {[0, 1, 2].map((i) => (
                      <MagicCard key={i} className="group p-6 border border-border bg-background/80">
                        <div className="flex flex-col gap-2 text-left">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {tWork(`tiles.${i}.title`)}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{tWork(`tiles.${i}.result`)}</p>
                        </div>
                      </MagicCard>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <MagicCard className="overflow-hidden">
                    <ExplainerVideo />
                  </MagicCard>
                  <BorderBeam size={260} className="hidden md:block" />
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="relative z-10 py-24 bg-background/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <BlurFade delay={0.2} inView>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {tHome('aboutSectionTitle')} <AuroraText>Thomas</AuroraText>
                </h2>
                <div className="space-y-4 text-lg text-slate-600 dark:text-white">
                  <p>{tHome('aboutDescription1')}</p>
                  <p>{tHome('aboutDescription2')}</p>
                  <p>{tHome('aboutDescription3')}</p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <div className="relative">
                <MagicCard className="p-8 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                      <Target className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Thomas Nicoli</h3>
                    <p className="text-muted-foreground mt-2">Strategy & AI Consultant</p>
                  </div>
                </MagicCard>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 bg-background/50">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <BlurFade delay={0.2} inView>
            <div className="relative">
              <MagicCard className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {tHome('chatCTATitle')} <AuroraText>{tHome('chatCTATitle2')}</AuroraText> {tHome('chatCTATitle3')}
                </h2>
                <p className="text-xl text-muted-foreground mb-8">{tHome('chatCTADescription')}</p>
                <div className="flex justify-center">
                  <Link href={`/${locale}/chat`} className="inline-block">
                    <ShimmerButton
                      background="rgba(0, 0, 0, 1)"
                      shimmerColor="#ffffff"
                      className="text-white dark:text-white text-sm sm:text-lg"
                    >
                      <span className="flex items-center gap-1.5 sm:gap-2">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                        {tHome('startConversation')}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                    </ShimmerButton>
                  </Link>
                </div>
              </MagicCard>
              <BorderBeam size={400} duration={15} />
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <BlurFade delay={0.1} inView>
            <h2 className="text-2xl font-bold mb-6">
              {tHome('finalCTATitle')} <AuroraText>{tHome('finalCTATitle2')}</AuroraText> {tHome('finalCTATitle3')}
            </h2>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-8 sm:py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base"
            >
              {tHome('getStartedToday')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </BlurFade>
        </div>
      </section>
    </div>
  );
}
