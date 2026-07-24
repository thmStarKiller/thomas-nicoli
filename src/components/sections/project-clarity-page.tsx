import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getProjectClarityCopy } from "@/i18n/project-clarity";
import type { ClarityRouteId } from "@/lib/project-clarity/contracts";
import { ProjectClarityForm } from "@/components/forms/project-clarity-form";

export function ProjectClarityPage({ lang, route }: { lang: Locale; route: ClarityRouteId }) {
  const copy = getProjectClarityCopy(lang).clarity;
  const legalReady = process.env.NEXT_PUBLIC_PROJECT_CLARITY_LEGAL_READY === "true";
  const consentVersion = process.env.NEXT_PUBLIC_PROJECT_CLARITY_CONSENT_VERSION ?? "pending-legal-approval";
  return (
    <>
      <section className="bg-graphite px-5 pb-20 pt-36 text-porcelain sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cobalt-bright">{copy.eyebrow}</p>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(3rem,7vw,6.8rem)] font-semibold leading-[0.98] tracking-tight">{copy.title}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-porcelain/70">{copy.intro}</p>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-porcelain/55">{copy.asyncNote}</p>
        </div>
      </section>
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <ProjectClarityForm lang={lang} initialRoute={route} legalReady={legalReady} consentVersion={consentVersion} />
          <div className="mt-8 text-center text-sm text-graphite/55">
            <Link className="underline hover:text-cobalt" href={`/${lang}/privacy`}>{copy.privacyLink}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
