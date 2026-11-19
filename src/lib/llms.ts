import { siteConfig } from "@/content/site-config";
import { dictionary as dict } from "@/i18n/dictionaries/en";
import { localeNames, localePath, locales } from "@/i18n/config";
import { getSite, type Accent } from "@/i18n/site";
import { absoluteUrl } from "./seo";

/**
 * /llms.txt: a plain summary of the site for AI assistants and answer
 * engines, following https://llmstxt.org. It is built from the same copy as
 * the pages, so prices, offers and limits can never drift from what a visitor
 * reads. English carries the facts; every page is linked in all three languages.
 */

const text = (accent: Accent | string) => (typeof accent === "string" ? accent : accent.join("")).trim();
const sentence = (value: string) => value.replace(/\s+/g, " ").trim();
const noStop = (value: string) => sentence(value).replace(/[.:]$/, "");
const clause = (value: string) => sentence(value).replace(/[.:;]$/, "");
const withStop = (value: string) => (/[.!?]$/.test(sentence(value)) ? sentence(value) : `${sentence(value)}.`);
const SOCIAL_NAMES: Record<string, string> = { linkedin: "LinkedIn", github: "GitHub", malt: "Malt", instagram: "Instagram" };

const PAGES: readonly { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/business", label: "AI services for businesses: audit, sprints and support" },
  { path: "/professionals", label: "AI workshops for professionals and teams, and content for agencies" },
  { path: "/work", label: "Experience and selected builds" },
  { path: "/about", label: "About Thomas Nicoli" },
  { path: "/contact", label: "Contact and booking" },
  { path: "/project-clarity", label: "Project Clarity: six questions to describe a project" },
];

function links(path: string): string {
  return locales.map((lang) => `[${localeNames[lang]}](${absoluteUrl(localePath(lang, path))})`).join(" · ");
}

export function buildLlmsText(): string {
  const lang = "en";
  const site = getSite(lang);
  const { identity, contact, features } = siteConfig;
  const business = absoluteUrl(localePath(lang, "/business"));
  const price = (amount: string, note: string) => (features.showPrices ? ` ${amount}, ${note}.` : "");
  const out: string[] = [];

  out.push(`# ${identity.studioName}`, "");
  out.push(`> ${sentence(dict.meta.home.description)}`, "");
  out.push(
    `${identity.ownerName} is an independent consultant based in ${identity.city}, Spain, who works in Spanish, English and French, on site in Madrid and remotely. ${sentence(dict.about.microBio)}`,
    "",
    `Role: ${dict.about.role}. Service area: ${dict.common.serviceArea}.`,
    "",
  );

  out.push("## Services for businesses", "");
  const audit = site.home.audit;
  out.push(`- [${noStop(text(audit.title))}](${business}#audit):${price(audit.price, audit.priceNote)} ${sentence(audit.text)} ${withStop(audit.timing)}`);
  for (const offer of site.business.build.offers) {
    const timing = offer.turnaround ? ` Turnaround: ${offer.turnaround}.` : "";
    out.push(`- [${offer.name}](${business}#${offer.slug}):${price(offer.price, offer.priceNote)}${timing} ${sentence(offer.line)}`);
  }
  out.push("", "## Websites and online shops", "", sentence(site.business.websites.intro), "");
  for (const offer of site.business.websites.offers) {
    out.push(`- [${offer.name}](${business}#${offer.slug}):${price(offer.price, offer.priceNote)} Turnaround: ${offer.turnaround}. ${sentence(offer.line)}`);
  }
  const small = site.business.small;
  out.push("", `## ${clause(small.title)}`, "", sentence(small.intro), "");
  for (const item of small.items) out.push(`- [${item.name}](${business}#${item.slug}):${features.showPrices ? ` ${item.price}, ${item.priceNote}.` : ""} ${sentence(item.text)}`);
  out.push("", sentence(small.hourly));
  out.push("", "## Ongoing support", "");
  const support = site.business.support;
  out.push(`- ${noStop(support.title)}:${price(support.price, support.priceNote)} ${sentence(support.text)}`);
  out.push(`- ${sentence(support.custom)}`, "");

  out.push("## For professionals, teams and agencies", "");
  for (const course of site.professionals.modules) {
    out.push(`- ${course.title} (${course.duration}): ${sentence(course.objective)}`);
  }
  const agencies = site.professionals.agencies;
  out.push(`- ${agencies.eyebrow}: ${sentence(agencies.intro)}`, "");

  out.push("## What he does not take on", "");
  for (const item of site.business.limits.items) out.push(`- ${sentence(item)}`);
  out.push("");

  out.push("## Frequently asked questions", "");
  const seen = new Set<string>();
  for (const item of [...site.home.faq.items, ...site.business.faq.items, ...site.professionals.faq.items]) {
    if (seen.has(item.question)) continue;
    seen.add(item.question);
    out.push(`### ${sentence(item.question)}`, "", sentence(item.answer), "");
  }

  out.push("## Selected builds and case studies", "");
  for (const item of site.work.cases) {
    out.push(`- [${item.title}](${absoluteUrl(localePath(lang, `/work/${item.slug}`))}) (${item.label}, ${item.status}): ${sentence(item.summary)}`);
  }
  out.push("");

  out.push("## Pages", "", "Every page exists in Spanish (the default), English and French.", "");
  for (const page of PAGES) out.push(`- ${page.label}: ${links(page.path)}`);
  out.push("");

  out.push("## Contact", "");
  out.push(`- Email: ${contact.email}`);
  if (contact.calendarUrl) out.push(`- Book a 30-minute intro call: ${contact.calendarUrl}`);
  out.push(`- Enquiry form: ${absoluteUrl(localePath(lang, "/contact"))}`);
  for (const [name, url] of Object.entries(contact.socials)) {
    if (url) out.push(`- ${SOCIAL_NAMES[name] ?? name}: ${url}`);
  }
  out.push("");

  return out.join("\n");
}
