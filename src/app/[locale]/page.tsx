'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { AuroraText } from '@/components/magicui/aurora-text';
import { BlurFade } from '@/components/magicui/blur-fade';
import ShimmerButton from '@/components/magicui/shimmer-button';
import { MagicCard } from '@/components/magicui/magic-card';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Particles } from '@/components/magicui/particles';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Zap, Target, Brain, Globe, MessageSquare } from 'lucide-react';

export default function Home() {
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

  const servicesData = tServices.raw('items') as Array<{title: string, desc: string}>;

  const services = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: servicesData[0]?.title,
      description: servicesData[0]?.desc
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: servicesData[1]?.title,
      description: servicesData[1]?.desc
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: servicesData[2]?.title,
      description: servicesData[2]?.desc
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: servicesData[3]?.title,
      description: servicesData[3]?.desc
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: servicesData[4]?.title,
      description: servicesData[4]?.desc
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: servicesData[5]?.title,
      description: servicesData[5]?.desc
    }
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={50}
        ease={80}
        color={color}
        refresh
      />

      {/* Hero Section */}
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
              <div className="text-sm text-muted-foreground mb-8">
                {tHome('trustedBy')}
              </div>
              <img 
                src="/images/placeholders/logo-strip.svg" 
                alt="Client logos" 
                className="w-full max-w-2xl mx-auto opacity-60 dark:invert" 
              />
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Animated Logo Banner */}
      <section className="relative z-10 py-8 bg-background/50 overflow-hidden">
        <div className="w-full overflow-hidden">
          <div className="flex animate-scroll">
            <div className="flex whitespace-nowrap">
              {/* First set of logos */}
              <div className="flex items-center gap-4 sm:gap-8 mr-4 sm:mr-8">
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SHOPIFY</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SALESFORCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">ADOBE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">MAGENTO</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">WOOCOMMERCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">BIGCOMMERCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SHOPIFY</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SALESFORCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">ADOBE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">MAGENTO</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">WOOCOMMERCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">BIGCOMMERCE</div>
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-4 sm:gap-8 mr-4 sm:mr-8">
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SHOPIFY</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SALESFORCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">ADOBE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">MAGENTO</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">WOOCOMMERCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">BIGCOMMERCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SHOPIFY</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">SALESFORCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">ADOBE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">MAGENTO</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">WOOCOMMERCE</div>
                <div className="text-lg sm:text-2xl font-bold text-muted-foreground/40">BIGCOMMERCE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <BlurFade delay={0.1} inView>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {tServices('title')} <AuroraText>{tHome('servicesSectionTitle')}</AuroraText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {tHome('servicesDescription')}
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <BlurFade key={i} delay={0.25 + i * 0.05} inView>
                <MagicCard className="group p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="relative z-10 py-24 bg-background/50">
        <div className="mx-auto max-w-6xl px-4">
          <BlurFade delay={0.1} inView>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {tWork('title')} <AuroraText>{tHome('workSectionTitle')}</AuroraText>
              </h2>
              <p className="text-xl text-muted-foreground">
                {tHome('workDescription')}
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n, i) => (
              <BlurFade key={n} delay={0.25 + i * 0.1} inView>
                <div className="relative group">
                  <div className="rounded-2xl overflow-hidden bg-card border border-border">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <img 
                        src={`/images/placeholders/case-${n}.svg`} 
                        alt={`Case study ${n}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">
                        {tWork(`tiles.${i}.title`)}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {tWork(`tiles.${i}.result`)}
                      </p>
                      <div className="text-sm font-medium text-primary">
                        {tHome('workMetric')}
                      </div>
                    </div>
                  </div>
                  <BorderBeam size={300} duration={12} delay={i} />
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <BlurFade delay={0.2} inView>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {tHome('aboutSectionTitle')} <AuroraText>Thomas</AuroraText>
                </h2>
                <div className="space-y-4 text-lg text-slate-600 dark:text-white">
                  <p>
                    {tHome('aboutDescription1')}
                  </p>
                  <p>
                    {tHome('aboutDescription2')}
                  </p>
                  <p>
                    {tHome('aboutDescription3')}
                  </p>
                </div>
              </div>
            </BlurFade>
            
            <BlurFade delay={0.4} inView>
              <div className="relative">
                <MagicCard className="p-8">
                  <img 
                    src="/images/placeholders/about-portrait.svg" 
                    alt="Thomas Nicoli"
                    className="w-full h-auto rounded-lg"
                  />
                </MagicCard>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Chat CTA Section */}
      <section className="relative z-10 py-24 bg-background/50">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <BlurFade delay={0.2} inView>
            <div className="relative">
              <MagicCard className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {tHome('chatCTATitle')} <AuroraText>{tHome('chatCTATitle2')}</AuroraText> {tHome('chatCTATitle3')}
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  {tHome('chatCTADescription')}
                </p>
                <ShimmerButton
                  background="rgba(0, 0, 0, 1)"
                  shimmerColor="#ffffff"
                  className="text-white dark:text-white text-sm sm:text-lg"
                >
                  <Link href={`/${locale}/chat`} className="flex items-center gap-1.5 sm:gap-2">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    {tHome('startConversation')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </ShimmerButton>
                <div className="mt-6">
                  <img 
                    src="/images/placeholders/chatbot-illustration.svg" 
                    alt="AI Chat Interface"
                    className="w-full max-w-md mx-auto opacity-80"
                  />
                </div>
              </MagicCard>
              <BorderBeam size={400} duration={15} />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Final CTA */}
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

