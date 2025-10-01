"use client";

import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

// Hero video section using Magic UI's dialog.
// Uses a local MP4 and a custom thumbnail poster.
export default function ExplainerVideo() {
  const locale = useLocale();
  const tHome = useTranslations('home');
  // Use the default video - remove the check for -fixed.mp4 to avoid 404 errors
  const videoSrc = "/videos/explainerThomas.mp4";

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {(() => {
          const v = tHome('videoTitle');
          if (typeof v === 'string' && !v.startsWith('home.')) return v;
          return locale === 'es'
            ? 'Descubre Cómo Transformamos Tu Negocio'
            : 'Discover How We Transform Your Business';
        })()}
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto">
        {(() => {
          const v = tHome('videoDescription');
          if (typeof v === 'string' && !v.startsWith('home.')) return v;
          return locale === 'es'
            ? 'Mira nuestro video explicativo de 2 minutos para entender cómo ayudamos a las empresas a lograr resultados extraordinarios con soluciones innovadoras.'
            : 'Watch our 2-minute explainer to understand how we help businesses achieve extraordinary results through innovative solutions.';
        })()}
      </p>

      <div className="mt-6">
        <HeroVideoDialog
          animationStyle="from-center"
          thumbnailSrc="/images/previewVideo.png"
          thumbnailAlt="Explainer video preview"
          isLocalVideo
          posterSrc="/images/previewVideo.png"
          videoSrc={videoSrc}
          className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl border border-white/10 bg-gradient-to-b from-black/60 to-black/20"
        />
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <Button asChild>
          <Link href={`/${locale}/contact`} aria-label={(() => {
            const v = tHome('videoCtaPrimary');
            if (typeof v === 'string' && !v.startsWith('home.')) return v;
            return locale === 'es' ? 'Comenzar' : 'Get Started';
          })()}>
            {(() => {
              const v = tHome('videoCtaPrimary');
              if (typeof v === 'string' && !v.startsWith('home.')) return v;
              return locale === 'es' ? 'Comenzar' : 'Get Started';
            })()}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/about`} aria-label={(() => {
            const v = tHome('videoCtaSecondary');
            if (typeof v === 'string' && !v.startsWith('home.')) return v;
            return locale === 'es' ? 'Más información' : 'Learn More';
          })()}>
            {(() => {
              const v = tHome('videoCtaSecondary');
              if (typeof v === 'string' && !v.startsWith('home.')) return v;
              return locale === 'es' ? 'Más información' : 'Learn More';
            })()}
          </Link>
        </Button>
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        <details className="mx-auto max-w-2xl">
          <summary className="cursor-pointer">{(() => {
            const v = tHome('videoTranscript');
            if (typeof v === 'string' && !v.startsWith('home.')) return v;
            return locale === 'es' ? 'Leer transcripción' : 'Read transcript';
          })()}</summary>
          <div className="mt-2 text-left">
            {locale === 'es' ? 'Transcripción próximamente. Si la necesitas ahora, por favor' : 'Transcript coming soon. If you need it now, please'}
            <Link className="underline ml-1" href={`/${locale}/contact`}>{locale === 'es' ? 'contáctanos' : 'contact us'}</Link>.
          </div>
        </details>
      </div>
    </div>
  );
}
