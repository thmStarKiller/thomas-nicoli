import { siteConfig } from "../../content/site-config";
import { localePath, type Locale } from "../../i18n/config";
import { getSite, type Accent, type Faq } from "../../i18n/site";
import { dictionary as enDictionary } from "../../i18n/dictionaries/en";
import { dictionary as esDictionary } from "../../i18n/dictionaries/es";
import { dictionary as frDictionary } from "../../i18n/dictionaries/fr";

const SKILLS: Record<Locale, readonly string[]> = {
  en: enDictionary.about.capabilities,
  es: esDictionary.about.capabilities,
  fr: frDictionary.about.capabilities,
};

/**
 * The facts the site assistant may state, built from the same copy the pages
 * show. Prices, offers, limits and answers therefore change in one place, and
 * the assistant can never quote something the site no longer says.
 *
 * Imports stay relative: this module is bundled into Cloudflare Functions too.
 */

const flat = (value: Accent | string) => (typeof value === "string" ? value : value.join("")).replace(/\s+/g, " ").trim();
const clause = (value: string) => flat(value).replace(/[.:;]$/, "");

function faqLines(items: readonly Faq[]): string[] {
  return items.map((item) => `  - Q: ${flat(item.question)} A: ${flat(item.answer)}`);
}

export function buildOfferFacts(lang: Locale): string {
  const site = getSite(lang);
  const { contact, identity } = siteConfig;
  const page = (path: string) => localePath(lang, path);
  const out: string[] = [];

  out.push(
    `- ${identity.ownerName} is an independent consultant based in ${identity.city}, Spain, who also works remotely, in Spanish, English and French.`,
    `- What he does: ${flat(site.home.hero.text)}`,
    `- How he works: ${site.home.method.rules.map(clause).join("; ")}.`,
    `- ${flat(site.home.method.text)} His employer is never named.`,
  );

  const audit = site.home.audit;
  out.push(
    "",
    `BUSINESSES (page ${page("/business")})`,
    `- Step I, ${clause(flat(audit.title))}: ${audit.price}, ${audit.priceNote}. ${audit.timing}. ${flat(audit.text)} Includes: ${audit.items.map(clause).join("; ")}. ${flat(audit.excluded)}`,
  );
  out.push(`- Step II, fixed-price builds. ${flat(site.business.build.intro)}`);
  for (const offer of site.business.build.offers) {
    const examples = offer.examples ? ` Typical workflows: ${clause(offer.examples)}.` : "";
    out.push(
      `  - ${offer.name}: ${offer.price} (${offer.priceNote}), ${offer.turnaround}. ${flat(offer.line)} Includes: ${offer.deliverables.map(clause).join("; ")}.${examples}`,
    );
  }
  const websites = site.business.websites;
  out.push(`- Websites and online shops (page ${page("/business")}#websites). ${flat(websites.intro)}`);
  for (const offer of websites.offers) {
    out.push(
      `  - ${offer.name}: ${offer.price} (${offer.priceNote}), ${offer.turnaround}. ${flat(offer.line)} Includes: ${offer.deliverables.map(clause).join("; ")}. ${websites.examplesLabel}: ${clause(offer.examples ?? "")}.`,
    );
  }
  const support = site.business.support;
  out.push(`- Step III, ${clause(support.title)}: ${support.price} ${support.priceNote}. ${flat(support.text)}`);
  out.push(`- ${flat(support.custom)}`);
  const small = site.business.small;
  out.push(`- ${clause(small.title)} ${flat(small.intro)}`);
  for (const item of small.items) {
    out.push(`  - ${item.name}: ${item.price} (${item.priceNote}). ${flat(item.text)}`);
  }
  out.push(`- ${flat(small.hourly)}`);
  out.push(`- Not taken on: ${site.business.limits.items.map(clause).join("; ")}.`);
  out.push(`- Published areas of skill (anything inside these can be quoted as a custom or hourly job): ${SKILLS[lang].map(clause).join("; ")}; plus everything in the offers above.`);

  const pro = site.professionals;
  out.push("", `PROFESSIONALS, TEAMS AND SCHOOLS (page ${page("/professionals")})`);
  for (const course of pro.modules) {
    out.push(`- ${course.title} (${course.duration}): ${flat(course.objective)} Covers: ${course.contents.map(clause).join("; ")}.`);
  }
  out.push(`- Practical details: ${pro.practical.items.map((item) => `${item.label}: ${clause(item.value)}`).join("; ")}.`);
  out.push(
    `- For agencies: ${flat(pro.agencies.intro)} Services: ${pro.agencies.services.map((s) => s.name).join("; ")}. How: ${pro.agencies.how.map(clause).join("; ")}. Not taken: ${pro.agencies.not.map(clause).join("; ")}.`,
  );

  out.push("", "ANSWERS ALREADY PUBLISHED ON THE SITE (reuse them; do not contradict them)");
  const seen = new Set<string>();
  const faqs = [...site.home.faq.items, ...site.business.faq.items, ...pro.faq.items].filter((item) => {
    if (seen.has(item.question)) return false;
    seen.add(item.question);
    return true;
  });
  out.push(...faqLines(faqs));

  out.push(
    "",
    "CONTACT AND NEXT STEPS",
    "- Free 30-minute intro call by video, Monday to Wednesday evenings, Madrid time. The chat panel shows a button to book it, and every page has Book a call buttons. Never write the booking link in a reply.",
    `- Enquiry form: ${page("/contact")}. ${flat(site.cta.reply)}.`,
    `- Email: ${contact.email}`,
    `- Not sure what to ask for: Project Clarity, six questions to describe the project (${page("/project-clarity")}).`,
    `- Experience and builds: ${page("/work")}. About Thomas: ${page("/about")}.`,
  );

  return out.join("\n");
}
