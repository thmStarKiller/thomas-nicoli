/**
 * Copy for the audience-led structure: home, the two audience pages and the
 * work index. Facts come from Thomas's own offer catalogue (version 3), his
 * verified profile and the repositories of his own builds. Nothing here names
 * an employer or claims a client result.
 */

/** A headline in three parts so the middle can be set in italic. */
export type Accent = readonly [before: string, accent: string, after: string];

export interface Faq {
  question: string;
  answer: string;
}

export interface Offer {
  /** Also the value sent by the contact form. */
  slug: string;
  name: string;
  line: string;
  price: string;
  priceNote: string;
  turnaround: string;
  deliverables: readonly string[];
  examples?: string;
}

export interface Door {
  numeral: string;
  title: string;
  text: string;
  meta: string;
  href: string;
}

export interface TimelineEntry {
  period: string;
  title: string;
  label: string;
  text: string;
}

export interface CaseItem {
  slug: string;
  period: string;
  title: string;
  label: string;
  status: string;
  summary: string;
  context: string;
  did: readonly string[];
  shows: string;
  tags: readonly string[];
  /** Internal path of a live demo on this site, if there is one. */
  href?: string;
}

export interface SiteCopy {
  nav: {
    business: string;
    professionals: string;
    work: string;
    about: string;
    contact: string;
    clarity: string;
    index: string;
  };
  cta: {
    contact: string;
    call: string;
    callOption: string;
    callHint: string;
    moreDetails: string;
    audit: string;
    question: string;
    reply: string;
  };
  labels: {
    price: string;
    turnaround: string;
    included: string;
    notIncluded: string;
    examples: string;
    context: string;
    did: string;
    shows: string;
    status: string;
    tags: string;
    next: string;
    back: string;
    tryIt: string;
    readCase: string;
    scroll: string;
    priceOnRequest: string;
  };
  home: {
    hero: {
      label: string;
      title: Accent;
      text: string;
      primary: string;
      secondary: string;
      caption: string;
      note: string;
    };
    ticker: readonly string[];
    facts: readonly { value: string; label: string }[];
    doors: { eyebrow: string; title: string; items: readonly Door[] };
    audit: {
      eyebrow: string;
      title: Accent;
      text: string;
      price: string;
      priceNote: string;
      timing: string;
      items: readonly string[];
      excluded: string;
    };
    work: { eyebrow: string; title: Accent; intro: string; cta: string };
    method: { eyebrow: string; title: Accent; text: string; rules: readonly string[]; cta: string };
    faq: { eyebrow: string; title: string; items: readonly Faq[] };
    final: { title: Accent; text: string; linkedin: string; clarity: string };
  };
  business: {
    meta: { title: string; description: string };
    hero: { eyebrow: string; title: Accent; intro: string };
    signals: { eyebrow: string; title: string; items: readonly string[] };
    steps: readonly { numeral: string; name: string; text: string }[];
    build: { eyebrow: string; title: Accent; intro: string; offers: readonly Offer[] };
    support: { eyebrow: string; title: string; text: string; price: string; priceNote: string; custom: string };
    limits: { eyebrow: string; title: string; items: readonly string[] };
    faq: { eyebrow: string; title: string; items: readonly Faq[] };
  };
  professionals: {
    meta: { title: string; description: string };
    hero: { eyebrow: string; title: Accent; intro: string };
    modules: readonly {
      numeral: string;
      title: string;
      duration: string;
      objective: string;
      contents: readonly string[];
      note: string;
    }[];
    practical: { eyebrow: string; title: string; items: readonly { label: string; value: string }[] };
    agencies: {
      eyebrow: string;
      title: Accent;
      intro: string;
      services: readonly { name: string; text: string }[];
      howTitle: string;
      how: readonly string[];
      notTitle: string;
      not: readonly string[];
      cta: string;
    };
    faq: { eyebrow: string; title: string; items: readonly Faq[] };
  };
  work: {
    meta: { title: string; description: string };
    hero: { eyebrow: string; title: Accent; intro: string };
    experience: { eyebrow: string; title: string; note: string; items: readonly TimelineEntry[] };
    education: { label: string; text: string };
    agenciesLine: { label: string; names: readonly string[] };
    builds: { eyebrow: string; title: string; note: string };
    cases: readonly CaseItem[];
  };
  about: {
    title: Accent;
    rulesTitle: string;
  };
}
