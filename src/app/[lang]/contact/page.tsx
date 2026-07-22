import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowUpRight, Calendar, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/contact",
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { contact } = siteConfig;
  // Widen `as const` literals so empty-string channels stay type-safe when filled in later.
  const phone: string = contact.phone;
  const calendarUrl: string = contact.calendarUrl;
  const whatsappUrl: string = contact.whatsappUrl;
  const linkedinUrl: string = contact.socials.linkedin;

  const channels = [
    calendarUrl && { icon: Calendar, label: dict.contact.channelsTitle, href: calendarUrl },
    whatsappUrl && { icon: MessageCircle, label: "WhatsApp", href: whatsappUrl },
    phone && { icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    linkedinUrl && { icon: ArrowUpRight, label: "LinkedIn", href: linkedinUrl },
  ].filter(Boolean) as { icon: typeof Calendar; label: string; href: string }[];

  return (
    <>
      <section className="bg-graphite pb-24 pt-40 text-porcelain sm:pb-32 sm:pt-48">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-porcelain/50">
            {dict.contact.eyebrow}
          </p>
          <TextReveal
            as="h1"
            text={dict.contact.title}
            className="max-w-4xl font-display text-[clamp(2.6rem,6vw,5.6rem)] font-semibold leading-[1.04] tracking-[-0.02em]"
          />
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-xl text-[15.5px] leading-relaxed text-porcelain/60">
              {dict.contact.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-porcelain py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24 lg:px-12">
          <Reveal>
            <Suspense>
              <ContactForm lang={lang} dict={dict} />
            </Suspense>
          </Reveal>

          <div>
            <h2 className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-graphite/50">
              {dict.contact.channelsTitle}
            </h2>
            <ul className="space-y-4">
              {channels.map((channel) => (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between rounded-2xl border border-graphite/12 px-6 py-5 transition-all duration-300 hover:border-cobalt hover:bg-porcelain-deep/60"
                  >
                    <span className="flex items-center gap-4 text-[15px] font-medium">
                      <channel.icon className="size-5 text-cobalt" />
                      {channel.label}
                    </span>
                    <ArrowUpRight className="size-4 text-graphite/40 transition-all duration-300 group-hover:text-cobalt" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-10 font-mono text-[11px] uppercase leading-loose tracking-[0.18em] text-graphite/45">
              {dict.common.basedIn}
              <br />
              {dict.hero.trustLine}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
