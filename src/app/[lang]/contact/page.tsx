import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/i18n/config";
import { getProjectClarityCopy } from "@/i18n/project-clarity";
import { getSite } from "@/i18n/site";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/ui/page-hero";
import { Rise } from "@/components/ui/rise";

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
  const site = getSite(lang);
  const contactCopy = getProjectClarityCopy(lang).contact;
  const { contact } = siteConfig;
  // Widen `as const` literals so empty-string channels stay type-safe when filled in later.
  const phone: string = contact.phone;
  const calendarUrl: string = contact.calendarUrl;
  const whatsappUrl: string = contact.whatsappUrl;
  const linkedinUrl: string = contact.socials.linkedin;

  const channels = [
    calendarUrl && { label: dict.nav.cta, href: calendarUrl },
    contact.email && { label: contact.email, href: `mailto:${contact.email}` },
    whatsappUrl && { label: "WhatsApp", href: whatsappUrl },
    phone && { label: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    linkedinUrl && { label: "LinkedIn", href: linkedinUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <PageHero
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        intro={dict.contact.intro}
        meta={site.cta.reply}
      />

      <section className="bg-sand py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
          <Rise className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="border border-night p-6 sm:p-10">
                  <h2 className="font-display text-3xl">{contactCopy.noJs}</h2>
                  <a href={`mailto:${contact.email}`} className="cta cta-on-sand mt-6">
                    {contact.email}
                  </a>
                </div>
              }
            >
              <ContactForm lang={lang} dict={dict} />
            </Suspense>
          </Rise>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="eyebrow text-spice">{dict.contact.channelsTitle}</h2>
            <ul className="mt-5 border-b border-night/25">
              {channels.map((channel) => (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="row-fill group flex min-h-14 items-center justify-between gap-4 border-t border-night/25 py-4 text-[17px]"
                  >
                    <span className="row-shift break-all">{channel.label}</span>
                    <ArrowUpRight aria-hidden className="row-arrow size-5 shrink-0" strokeWidth={1.3} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-8 leading-loose text-night-mute">
              {dict.common.basedIn}
              <br />
              {site.home.hero.note}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
