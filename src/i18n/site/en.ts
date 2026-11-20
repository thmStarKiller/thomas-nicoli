import type { SiteCopy } from "./types";

export const site: SiteCopy = {
  nav: {
    business: "Businesses",
    professionals: "Professionals",
    work: "Work",
    about: "About",
    contact: "Contact",
    clarity: "Project Clarity",
    index: "Index",
  },
  cta: {
    contact: "Get in touch",
    call: "Book a call",
    callOption: "An intro call",
    callHint: "Give me two or three times that suit you, Madrid time. I will confirm one by email.",
    moreDetails: "Add details (optional)",
    audit: "Request the audit",
    question: "Ask a question",
    reply: "I reply within one working day",
  },
  labels: {
    price: "Price",
    turnaround: "Turnaround",
    included: "What you get",
    notIncluded: "Not included",
    examples: "Typical workflows",
    context: "Context",
    did: "What I built",
    shows: "What it shows",
    status: "Status",
    tags: "Stack",
    next: "Next build",
    back: "All work",
    tryIt: "Try it on this site",
    readCase: "Read the case",
    scroll: "Scroll",
    priceOnRequest: "Quoted per group",
  },

  home: {
    hero: {
      label: "AI consultant · Madrid",
      title: ["AI that ", "earns its place", " in your business."],
      text: "I set up AI assistants that take over the repetitive computer work in your business, inside the software you already use wherever possible. Fixed prices, one useful step at a time, and you approve each one.",
      primary: "Book a call",
      secondary: "Request the €490 audit",
      caption: "Thomas Nicoli, Madrid",
      note: "Two projects at a time, by choice",
    },
    ticker: ["AI office assistants","AI audits","Lead response","Admin automation","Website assistants","Reporting","Review replies","Websites","Workshops","French content"],
    facts: [
      { value: "10+", label: "years in digital commerce and content" },
      { value: "3", label: "working languages: French, English and Spanish" },
      { value: "€490", label: "fixed price for the first step" },
      { value: "2", label: "projects at a time, never more" },
    ],
    doors: {
      eyebrow: "Start here",
      title: "Where do you want to begin?",
      items: [
        {
          numeral: "I",
          title: "For businesses",
          text: "AI office assistants that take over repetitive computer work, one task at a time, with you in control.",
          meta: "Audit at €490, small tasks from €390",
          href: "/business",
        },
        {
          numeral: "II",
          title: "For professionals and teams",
          text: "Workshops where each person leaves with one of their own tasks handled by AI.",
          meta: "Online or in Madrid",
          href: "/professionals",
        },
        {
          numeral: "III",
          title: "For agencies",
          text: "French e-commerce content, language QA and review of AI output, billed by the hour.",
          meta: "Batches from 48 hours",
          href: "/professionals#agencies",
        },
      ],
    },
    audit: {
      eyebrow: "The first step",
      title: ["The AI ", "Opportunity", " Audit."],
      text: "A short, fixed-price review that tells you where automation would save your team time, what it would cost to build, and what to leave alone.",
      price: "€490",
      priceNote: "fixed, excluding VAT",
      timing: "Delivered in 3 to 5 business days",
      items: [
        "A review of your public website and the customer journey, from first enquiry to booking or purchase",
        "A map of the repetitive tasks and friction points, with the time each one takes today",
        "A prioritised list of automation opportunities, each with effort, risk and data considerations",
        "A one-page roadmap for the first one worth building",
        "One 45-minute call to walk through the findings",
      ],
      excluded:
        "Not included: building the automation, access to production systems, security audits and legal advice.",
    },
    work: {
      eyebrow: "Work",
      title: ["Real work, ", "described as it is.", ""],
      intro:
        "More than ten years of digital commerce, and the AI tools I build to test what holds up in practice. No invented clients, no borrowed results.",
      cta: "See all work",
    },
    method: {
      eyebrow: "How I work",
      title: ["Small scope, ", "written down,", " delivered on the date."],
      text: "I am Thomas Nicoli: French, based in Madrid, working in English and Spanish every day. I work in-house on e-commerce platforms and take independent projects outside office hours.",
      rules: [
        "Two projects at a time, at most. I confirm every date before I commit to it.",
        "A fixed price and a written scope before anything starts. One round of corrections is included.",
        "You approve each step before it goes live. I do not build fully autonomous systems.",
        "I never ask for passwords by email, and I delete your working data when the project ends unless you ask me to keep it.",
        "No medical, financial or legal data. If a project is not for me, I say so early.",
      ],
      cta: "More about me",
    },
    faq: {
      eyebrow: "Questions",
      title: "What people ask before they write.",
      items: [
        {
          question: "How much does it cost?",
          answer:
            "The audit is €490, fixed. Builds are fixed-price too, from €690 for review replies to €2,250 for a website assistant, and websites start at €590. You get the figure in writing before anything starts. If the budget is tight, a one-to-one session costs €90 and small fixed jobs start at €390. Third-party costs, such as software subscriptions, are listed separately before you accept.",
        },
        {
          question: "Will AI act without me?",
          answer:
            "No. Every automation has a human escalation path, and you approve each step before it goes live. I do not set up fully autonomous systems.",
        },
        {
          question: "What happens to my data?",
          answer:
            "We agree what each tool may see before anything is connected. I never ask for passwords by email, I do not work with medical, financial or legal data, and I delete working data at the end of the project unless you ask me to keep it.",
        },
        {
          question: "What if AI is not the right answer?",
          answer:
            "Then the audit says so. Part of the job is telling you what to leave alone, or where a plain rule-based automation does the job better than a model.",
        },
        {
          question: "Do I need to be technical?",
          answer:
            "No. You describe the task in your own words. I handle the set-up and leave a handover guide written for the person who will use it.",
        },
        {
          question: "Is this your full-time business?",
          answer:
            "No. I work in-house on e-commerce platforms during the day and take independent projects outside office hours, completely separate from that role. That is why I take two projects at most and confirm every date before I commit.",
        },
        {
          question: "Where do you work?",
          answer:
            "I am based in Madrid and work with businesses in and around the city, and remotely elsewhere, in Spanish, English or French.",
        },
      ],
    },
    final: {
      title: ["Tell me what ", "eats your week.", ""],
      text: "Send a few lines about the task that keeps coming back. I reply within one working day, usually in the evening, Madrid time.",
      linkedin: "LinkedIn",
      clarity: "Prefer to write it down first? Answer six questions in Project Clarity.",
    },
  },

  business: {
    meta: {
      title: "AI office assistants, automation and websites",
      description:
        "AI assistants that take over repetitive computer work in the tools you already use. A €490 audit, fixed prices, and websites from €590. Madrid and remote.",
    },
    hero: {
      eyebrow: "For businesses",
      title: ["Less repetitive work, ", "one fixed-price step", " at a time."],
      intro:
        "For small and mid-sized businesses in and around Madrid, and remote teams elsewhere. We start with a short audit, build one thing that saves time, and only then decide whether to go further.",
    },
    assistants: {
      eyebrow: "AI Office Assistants",
      tagline: "The repetitive work, taken care of.",
      title: ["Less copying, pasting and chasing. ", "More time", " for the work that matters."],
      paragraphs: [
        "Every business has tasks that eat hours each week: retyping details from emails into a spreadsheet, updating the same customer in two or three places, sending the same replies, rebuilding the same documents.",
        "AI Office Assistants take that work off your team. I look at how your business runs today, choose the tasks where an assistant will save real time, and set it up around your existing tools and your way of working. You do not need to change your software or learn anything technical.",
        "Each assistant follows rules you approve. It handles the routine cases and passes anything unusual to a person, so you always know what it did and you stay in control.",
        "We start small: one task, set up and tested in a few weeks, at a fixed price agreed before any work begins. If it earns its place, we look at the next one.",
      ],
      howTitle: "How it works",
      how: [
        { name: "A free call", text: "30 minutes. You tell me which tasks take the most time." },
        { name: "A close look", text: "I see how the work is done today, pick the tasks where an assistant will save real time, and tell you which ones are better left alone." },
        { name: "Set-up", text: "I build the assistant around your tools and your rules, we test it together on real examples, and I show your team how to use it." },
        { name: "It starts working", text: "You check the results, and we adjust it or move on to the next task." },
      ],
      problemsTitle: "What it can take over",
      problems: [
        "Details copied by hand from emails or web forms into spreadsheets or other software",
        "The same information updated in several places",
        "Enquiries that wait hours for a first reply",
        "Routine emails, confirmations and reminders written one by one",
        "Orders, bookings or appointments typed again into another system",
        "Quotes, documents and weekly reports rebuilt from scratch",
        "Files and attachments saved, renamed and sorted by hand",
        "Information spread across tools, so nobody has the full picture",
        "Staff switching between screens all day to finish one simple task",
        "Small mistakes caused by retyping the same data",
      ],
      benefitsTitle: "What you get",
      benefits: [
        "Hours back every week for customers, sales and decisions",
        "Fewer typing mistakes and forgotten follow-ups",
        "Faster replies to customers",
        "No new software to learn and no large IT project",
        "Rules you approve, with a person in charge of anything important",
        "A small first step at a fixed price, so the risk stays low",
        "Set up for your business, with someone to adjust it as the business changes",
      ],
      compare:
        "A chatbot answers questions. A traditional automation project usually means new software, months of work and a large budget. An AI Office Assistant does the routine work itself, inside the tools you already use, and is ready in weeks at a fixed price, with a person checking anything that matters.",
      price: "One assistant for one task: €1,650, typical fixed price, in 7 to 14 business days. Smaller tasks from €390.",
      cta:
        "Tell me which task your team would most like to stop doing. In a free 30-minute call we will look at whether an assistant can take it over, and what it would cost.",
      ctaButton: "Book a free call",
    },
    signals: {
      eyebrow: "Signs it is worth a look",
      title: "Does any of this sound familiar?",
      items: [
        "Enquiries arrive by email, phone and forms, and nobody is sure which have been answered.",
        "Quotes, bookings or documents are prepared by hand, one at a time.",
        "Details are copied from emails into spreadsheets.",
        "A message that arrives after hours gets no acknowledgement until the next day.",
        "Customers write in several languages, and replies in the second one take longer.",
        "The same questions are answered again every week.",
        "Google reviews wait days for a reply, and some are in languages nobody on the team writes.",
      ],
    },
    steps: [
      {
        numeral: "I",
        name: "Audit",
        text: "A fixed-price review of where automation would save time, and what to leave alone.",
      },
      {
        numeral: "II",
        name: "Build one thing",
        text: "One agreed workflow, built, tested and handed over at a fixed price.",
      },
      {
        numeral: "III",
        name: "Keep it running",
        text: "Optional monthly support for monitoring and small changes.",
      },
    ],
    build: {
      eyebrow: "Step II",
      title: ["Build ", "one thing", " that saves time."],
      intro:
        "Each sprint covers one agreed workflow, with tests, a human escalation path and a handover guide. The price is confirmed in writing before work starts.",
      offers: [
        {
          slug: "ai-lead-response-sprint",
          name: "AI Lead Response Sprint",
          line: "Every enquiry acknowledged, sorted and summarised, with a person in the loop.",
          price: "€1,500",
          priceNote: "typical fixed price",
          turnaround: "7 to 14 business days",
          deliverables: [
            "Automatic acknowledgement of each enquiry",
            "Lead sorting and qualification rules",
            "Approved answers to frequent questions, with human escalation",
            "Structured lead summaries, testing and handover notes",
          ],
          examples:
            "Enquiries by email, web form or WhatsApp Business, for real estate agencies, language schools, tour operators and small hotels. Meta's WhatsApp message fees are listed separately.",
        },
        {
          slug: "administrative-automation-sprint",
          name: "AI Office Assistant",
          line: "One repetitive task taken over, tested and handed over, inside the tools you already use.",
          price: "€1,650",
          priceNote: "typical fixed price",
          turnaround: "7 to 14 business days",
          deliverables: [
            "One agreed workflow, specified in writing",
            "A working automation or proof of concept",
            "Tests, exception handling and human escalation",
            "A handover guide and one handover session",
          ],
          examples:
            "Inbox sorting, draft replies, document routing, data extraction, spreadsheet updates, meeting-note summaries, quote requests.",
        },
        {
          slug: "multilingual-ai-website-assistant",
          name: "Multilingual AI Website Assistant",
          line: "An assistant on your site that answers from content you approve, in Spanish and English, with French as an option.",
          price: "€2,250",
          priceNote: "typical fixed price",
          turnaround: "10 to 20 business days",
          deliverables: [
            "A knowledge base built from your approved content",
            "Spanish and English, with French as an option",
            "FAQ answers, lead capture and handoff to booking or contact",
            "Escalation rules, testing and documentation",
            "Says clearly that it is an AI, and hands over to a person on request",
          ],
        },
        {
          slug: "ai-reporting-content-system",
          name: "AI Reporting and Content System",
          line: "Recurring reports and content prepared for you to check and send.",
          price: "€1,250",
          priceNote: "typical fixed price",
          turnaround: "7 to 14 business days",
          deliverables: [
            "Automated report preparation or data consolidation",
            "Templates for executive summaries and reusable content",
            "A quality-control and human approval step",
            "Scheduling specification, testing and documentation",
          ],
        },
        {
          slug: "review-reply-assistant",
          name: "Review Reply Assistant",
          line: "Every Google review answered in the reviewer's language and in your voice, with you approving each reply.",
          price: "€690",
          priceNote: "typical fixed price",
          turnaround: "5 to 7 business days",
          deliverables: [
            "A digest of new reviews, daily or weekly",
            "Draft replies in the reviewer's language, in your tone of voice",
            "You approve, edit and post each reply; nothing is published without you",
            "A monthly summary of the praise and complaints that keep coming back",
          ],
          examples:
            "Replies to Google reviews for hotels and short-stay rentals, restaurants, tour operators, language schools and shops with foreign customers.",
        },
      ],
    },
    websites: {
      eyebrow: "Websites",
      title: ["Websites that ", "work in three languages", " and get found."],
      intro:
        "Fixed-price websites and small online shops, built with AI-assisted development and checked page by page. Each one is fast on phones, ready for search engines and AI assistants, and handed over with a guide. You own the domain, the code and the content; hosting and platform fees are paid by you directly and listed before you accept.",
      examplesLabel: "Good for",
      offers: [
        {
          slug: "landing-page",
          name: "Landing page",
          line: "One page for a service, a launch or a campaign, written to turn visits into enquiries.",
          price: "€590",
          priceNote: "typical fixed price",
          turnaround: "7 to 10 business days",
          deliverables: [
            "One page, written and designed around a single action",
            "A contact or booking form, with enquiries sent to your inbox",
            "Fast on phones, with titles, descriptions and share images set",
            "Hosting set up on your own account, and a handover guide",
          ],
          examples:
            "A new service, an event, a product launch, an advertising campaign.",
        },
        {
          slug: "business-website",
          name: "Business website",
          line: "Up to six pages that explain what you sell and make it easy to get in touch, in Spanish and English, with French as an option.",
          price: "€1,490",
          priceNote: "typical fixed price",
          turnaround: "10 to 20 business days",
          deliverables: [
            "Up to six pages: home, services, about, contact and two more",
            "Spanish and English, with French as an option, each page written for its language",
            "Search basics: page titles, descriptions, sitemap, Google Search Console and structured data",
            "A contact form, analytics and a guide for editing the content",
          ],
          examples:
            "Restaurants, language schools, real estate agencies, tour operators, independent professionals.",
        },
        {
          slug: "online-shop",
          name: "Small online shop",
          line: "A Shopify shop set up properly by someone who works on e-commerce platforms every day.",
          price: "€1,190",
          priceNote: "typical fixed price",
          turnaround: "10 to 15 business days",
          deliverables: [
            "A Shopify theme set up and adapted to your brand",
            "Up to 20 products loaded from your texts and photos, with collections, payments and shipping for Spain",
            "Product pages laid out and checked in one language, a second on request",
            "Order emails checked, analytics, and a handover session",
          ],
          examples:
            "Small D2C brands, makers, food and wine producers, shops selling to foreign customers. Shopify's monthly fee and apps are paid by you directly.",
        },
      ],
    },
    support: {
      eyebrow: "Step III",
      title: "Monthly support and optimisation.",
      text: "Three hours a month of monitoring, prompt and rule improvements, small changes and a short report.",
      price: "€290",
      priceNote: "a month",
      custom: "Something else in mind? Custom projects run from €650 to €3,500, always with a written scope.",
    },
    small: {
      eyebrow: "Smaller budget",
      title: "Cheaper ways to start.",
      intro:
        "Not ready for a full build? These are small and fixed, and each one can grow into a sprint or a website later.",
      items: [
        {
          slug: "ai-session",
          name: "One-to-one AI session",
          price: "€90",
          priceNote: "60 minutes, online",
          text: "Bring a question, a tool or a task. We set it up together on your screen, and you leave with written notes.",
        },
        {
          slug: "quick-win",
          name: "Quick win",
          price: "€390",
          priceNote: "3 to 5 business days",
          text: "One small automation or fix, scoped in writing: an automatic reply, a form that fills a spreadsheet, a weekly digest of reviews or emails.",
        },
        {
          slug: "website-refresh",
          name: "Website refresh",
          price: "€390",
          priceNote: "3 to 5 business days",
          text: "Your current site, cleaned up: texts, speed, search basics and a contact form that really reaches you.",
        },
        {
          slug: "light-support",
          name: "Light support",
          price: "€95",
          priceNote: "a month",
          text: "One hour a month for small changes and checks on something I built for you.",
        },
      ],
      hourly:
        "Anything else that is small and within my skills is billed at €90 an hour, with a written estimate before I start. Prices exclude VAT.",
    },
    limits: {
      eyebrow: "Limits",
      title: "What I do not take on.",
      items: [
        "Round-the-clock operations or out-of-hours standby",
        "Medical, financial, legal or other regulated data",
        "Unlimited revisions or open-ended support",
        "Promises of guaranteed revenue",
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Before you request the audit.",
      items: [
        {
          question: "Is the first call free?",
          answer:
            "Yes. The intro call is free and takes 30 minutes by video, on a Monday to Wednesday evening. We look at whether something is worth automating, and you get a straight answer either way.",
        },
        {
          question: "What do you need from me for the audit?",
          answer:
            "A 30-minute kick-off call, on a weekday evening or at lunchtime, and honest answers about how the work runs today. I do not need access to your systems.",
        },
        {
          question: "Do I have to build something after the audit?",
          answer:
            "No. The audit stands on its own. You keep the task map, the priorities and the roadmap whether or not we work together again.",
        },
        {
          question: "How long does a build take?",
          answer:
            "Between 5 and 20 business days depending on the build. The audit itself takes 3 to 5 business days after the kick-off.",
        },
        {
          question: "Are there extra costs?",
          answer:
            "Third-party costs, such as software subscriptions or model usage, are listed separately before you accept. Prices exclude VAT.",
        },
        {
          question: "What if the AI gets something wrong?",
          answer:
            "It answers only from content you approve, anything it is unsure about goes to a person, and you approve each step before it goes live. Every build is tested on real examples before handover, and assistants say clearly that they are an AI.",
        },
        {
          question: "Which businesses do you turn down?",
          answer:
            "Anything that needs medical, financial or legal data. Legal adult (18+) businesses and licensed gambling operators are welcome, as long as the work does not involve sensitive customer data. I also avoid beauty and cosmetics accounts, to prevent any conflict of interest.",
        },
      ],
    },
  },

  professionals: {
    meta: {
      title: "AI workshops for professionals and teams",
      description:
        "Practical AI workshops for marketing, e-commerce and operations people, in Spanish, English or French. Also French e-commerce content for agencies.",
    },
    hero: {
      eyebrow: "For professionals and teams",
      title: ["Leave with one of ", "your own tasks", " handled by AI."],
      intro:
        "Practical sessions for marketing, e-commerce and operations people who have tried the tools and want results they can rely on. Taught by someone who runs the work every day, in Spanish, English or French.",
    },
    modules: [
      {
        numeral: "A",
        title: "Practical AI for marketing and e-commerce teams",
        duration: "Module of 6 to 10 hours, or a 3-hour workshop",
        objective:
          "Each participant finishes with one repetitive task from their own job solved with AI, and knows how to judge whether the result can be trusted.",
        contents: [
          "Where AI saves time and where it wastes it: how to choose the task",
          "Working methods: thread summaries, content review, briefs and documentation",
          "Quality, data and confidentiality: what never goes into a tool, and how to check what comes back",
          "Workshop: each person automates a task of their own and presents a before and an after",
        ],
        note: "I use these tools every day to summarise, review content and document, and I teach that concrete use, with its limits.",
      },
      {
        numeral: "B",
        title: "Running D2C e-commerce in several markets",
        duration: "Module of 8 to 12 hours, or a 2-hour masterclass",
        objective:
          "Participants can plan and validate a launch in a new market, from the requirement to launch day.",
        contents: [
          "Anatomy of a D2C platform: catalogue, content, promotions, checkout and CRM, and who owns each part",
          "From brief to launch: clear requirements, acceptance tests and a handover someone else can use",
          "Localisation in practice: languages, prices, legal mentions and each country's commercial calendar",
          "Transactional emails and customer journeys: what is sent, when, and how it is checked",
          "Measuring and deciding: the funnel, the indicators and the monthly report people read",
        ],
        note: "Final case: launching a fictional brand in France and Spain.",
      },
      {
        numeral: "C",
        slug: "ai-starter",
        title: "AI starter for small teams",
        duration: "One 2-hour session for up to 10 people · €450",
        objective:
          "Your team agrees which AI tools to use, with which data, and how to check what comes back, and you keep a written record of it.",
        contents: [
          "Which tasks in your business are worth handing to AI, and which are not",
          "What never goes into a tool: client data, passwords, confidential documents",
          "How to check an AI answer before it reaches a customer",
          "A one-page AI use policy written for your team, and an attendance record",
        ],
        note: "Practical training and a usage policy, not legal advice. The EU AI Act asks companies that use AI to help their staff understand it; this is a simple, documented way to start.",
      },
    ],
    practical: {
      eyebrow: "Practical details",
      title: "How the sessions run.",
      items: [
        { label: "Formats", value: "Workshop, module, masterclass, or tutoring of final projects for schools" },
        { label: "Where", value: "Online or in Madrid" },
        { label: "When", value: "Live from Monday to Wednesday evenings, or self-paced online" },
        { label: "Languages", value: "Spanish, English or French" },
        { label: "Cases", value: "All classroom cases use fictional companies. No employer or client information is used." },
        { label: "Price", value: "3-hour workshop: €750 per group of up to 12. Module of 6 to 10 hours: from €1,800 per group. AI starter for small teams: €450. Schools: the centre's rate. Prices exclude VAT." },
      ],
    },
    agencies: {
      eyebrow: "For agencies",
      title: ["French e-commerce content, ", "checked by someone", " who runs the shop."],
      intro:
        "French-native content, SEO and language quality for online retail, billed by the hour. I work from English and Spanish into French, and I check how the words behave on a live page as well as how they read.",
      services: [
        {
          name: "Multilingual SEO in French",
          text: "Keyword research and mapping, on-page copy, titles and meta descriptions, and localisation of SEO briefs written in English or Spanish.",
        },
        {
          name: "E-commerce copywriting and transcreation",
          text: "Product and category pages, campaign landing pages, CRM emails, push and SMS, written for the French market from an English or Spanish source.",
        },
        {
          name: "Linguistic QA and in-context review",
          text: "Review on staging sites, email renders and interface strings, with a severity-rated issue log your team can act on without a call.",
        },
        {
          name: "Review and adaptation of AI output",
          text: "Quality review of machine-translated or AI-generated French content against a style guide, with glossary and prompt feedback.",
        },
        {
          name: "AI training and evaluation in French",
          text: "Rating, rewriting and rubric-based evaluation of model output on marketing, retail and e-commerce subjects.",
        },
      ],
      howTitle: "How I work with agencies",
      how: [
        "Asynchronous batches, with turnaround from 48 hours",
        "Hourly or day-rate billing, quoted per project",
        "NDA and vendor onboarding welcome",
        "I only accept deadlines I am certain to meet",
      ],
      notTitle: "What I do not take",
      not: [
        "Per-word translation or post-editing at word rates",
        "Same-day rush work or office-hours standby",
        "Beauty and cosmetics accounts, to avoid any conflict of interest",
      ],
      cta: "Ask for the capability sheet",
    },
    faq: {
      eyebrow: "Questions",
      title: "Before you book a session.",
      items: [
        {
          question: "Who are the sessions for?",
          answer:
            "People in marketing, e-commerce, content and operations who already use a chat assistant now and then and want a method. No technical background is needed.",
        },
        {
          question: "Can you train a team inside a company?",
          answer:
            "Yes. The workshop is built around the team's real tasks, and I use fictional data wherever the real material is confidential.",
        },
        {
          question: "How much does it cost?",
          answer:
            "A 3-hour workshop is €750 for a group of up to 12, and a module of 6 to 10 hours starts at €1,800 per group. The AI starter for small teams is €450. Prices exclude VAT, and you get a fixed quote before anything is booked.",
        },
        {
          question: "Do we have to train our staff because of the EU AI Act?",
          answer:
            "The EU AI Act asks companies that use AI to take measures so their staff understand it well enough. It does not require a certificate or a set course. A short session with a written usage policy is a practical, documented first step. For a legal reading of your own case, ask a lawyer.",
        },
        {
          question: "Can the training be funded through FUNDAE?",
          answer:
            "If your company manages its FUNDAE training credit, it can organise the course and hire me as the trainer. For very small companies the credit is limited, so check the amount with your gestoría first.",
        },
        {
          question: "Do you do one-to-one sessions?",
          answer:
            "Yes. A one-to-one AI session costs €90 for 60 minutes online: bring a question, a tool or a task, and you leave with written notes.",
        },
        {
          question: "Do you teach at schools?",
          answer:
            "Yes, as a guest for a masterclass, a full module or the tutoring of final projects, in Spanish, French or English.",
        },
      ],
    },
  },

  work: {
    meta: {
      title: "Work: experience and builds",
      description:
        "More than ten years of digital commerce and content work, and the AI tools Thomas Nicoli built himself. No invented clients, no borrowed results.",
    },
    hero: {
      eyebrow: "Work",
      title: ["Real work, ", "described as it is.", ""],
      intro:
        "Two kinds of evidence. Experience: more than ten years of digital commerce, content and platform work. Builds: AI tools I designed and built myself to test what holds up. Employers are not named and no client results are claimed.",
    },
    experience: {
      eyebrow: "Experience",
      title: "Ten years, three chapters.",
      note: "Taken from my CV. My current employer is not named, and no internal information appears on this site.",
      items: [
        {
          period: "2023 to today",
          title: "D2C e-commerce platforms across European markets",
          label: "In-house",
          text: "Day-to-day operation of direct-to-consumer online shops serving several European countries: content, promotions, transactional and marketing emails, localisation and release testing.",
        },
        {
          period: "Before 2023",
          title: "A portfolio of 16 websites in 5 languages",
          label: "Digital agency",
          text: "At a digital agency, I managed a portfolio of sixteen websites in five languages.",
        },
        {
          period: "2017 to 2022",
          title: "Multilingual SEO and translation",
          label: "Freelance, as Metamorphoses Consulting",
          text: "Freelance multilingual SEO specialist and translator for language and search agencies, including TransPerfect, Travod and Webcertain.",
        },
      ],
    },
    education: {
      label: "Education",
      text: "Master's degree in Intercultural Management, Marketing and Translation, ISIT Paris.",
    },
    agenciesLine: {
      label: "Agencies I have worked for as a freelancer",
      names: ["TransPerfect", "Travod", "Webcertain"],
    },
    builds: {
      eyebrow: "Builds",
      title: "Things I built to see what works.",
      note: "Self-initiated projects, each started from a specific friction. They are prototypes and working tools, shown at the stage they reached.",
    },
    cases: [
      {
        slug: "site-chat",
        period: "2026",
        title: "The chat on this site",
        label: "AI website assistant",
        status: "Part of this site",
        summary:
          "Answers questions about my services with a Nemotron model hosted by NVIDIA, and a local open-source model as backup.",
        context:
          "I wanted a site assistant that answers in seconds, stays within what I have published, and tells me what people are asking.",
        did: [
          "Each message and a bounded amount of recent context are stored on Cloudflare and sent to NVIDIA's API",
          "The Nemotron 3.5 Super VL model writes the reply from the offers and prices published on this site",
          "If that service does not respond, the message waits in a secure queue and a Gemma model, run locally through Ollama on my computer, answers it",
          "After each processed turn, a summary reaches me by email",
          "Sessions are anonymous, protected by Turnstile and limited to two hours and twelve turns",
          "Messages are kept for 30 days and deleted earlier on request",
        ],
        shows:
          "An assistant can answer quickly from a hosted model and keep a private one in reserve. The key stays on the server, and the visitor is told which provider answers.",
        tags: ["Nemotron", "NVIDIA API", "Gemma", "Ollama", "Cloudflare Pages Functions", "D1", "Turnstile", "Resend"],
      },
      {
        slug: "project-clarity",
        period: "2026",
        title: "Project Clarity",
        label: "AI-assisted diagnostic",
        status: "Part of this site",
        summary:
          "Six questions about a project, a first read by a local model, and a human review before any reply.",
        context:
          "Most first conversations start from a vague brief. I wanted a way for someone to describe the problem properly before we talk, without a chatbot improvising answers.",
        did: [
          "Six questions on the project type, the blockage, existing systems, the result worth having, constraints and language",
          "The request waits in a secure queue, even when my computer is off",
          "A Gemma model gives a first read locally, from sanitised fields only",
          "I review the report and every draft before replying, and nothing is sent autonomously",
          "Retention of 30 days, with earlier deletion on request",
        ],
        shows: "A model can prepare the work while a person still owns the answer.",
        tags: ["Gemma", "Local inference", "Human review", "Three languages"],
        href: "/project-clarity",
      },
      {
        slug: "sfcc-inspector",
        period: "2026",
        title: "SFCC Inspector",
        label: "Code explained to non-developers",
        status: "Proof of concept",
        summary:
          "An AI-assisted explorer that explains Salesforce Commerce Cloud code in plain language.",
        context:
          "On commerce platforms, business teams depend on code they cannot read. A simple question about how a setting works can wait days for a developer.",
        did: [
          "A file explorer for the cartridges of a commerce site, with full-text search",
          "Summaries that explain what a file does and why, in plain language",
          "Questions and answers about the code in natural language",
          "Detection of platform patterns such as hooks and preferences",
          "A desktop mode and a cloud mode, with a choice of AI provider",
        ],
        shows:
          "The gap between business and technical teams is often a translation problem, and a model translates well when someone designs the questions.",
        tags: ["React", "FastAPI", "Google Gemini", "WebDAV"],
      },
      {
        slug: "starcandidate",
        period: "2026",
        title: "STARCandidate",
        label: "CV tailoring platform",
        status: "Web application",
        summary: "Adapts a CV to a job description, with templates and AI headshots.",
        context:
          "Applying for jobs means rewriting the same CV for every advert. I built a tool that does the first pass.",
        did: [
          "CV analysis that adapts a resume to a given job description",
          "A headshot studio that produces a professional portrait from a selfie",
          "A set of CV templates",
          "Accounts, an admin dashboard and serverless functions",
        ],
        shows:
          "A complete product around a model: accounts, administration and the unglamorous parts that make an AI feature usable.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Appwrite"],
      },
      {
        slug: "bandersnatch-ai",
        period: "2026",
        title: "Bandersnatch AI",
        label: "Creative photo transformation",
        status: "Web application",
        summary: "Transforms photos with generative AI, with credits and payments.",
        context:
          "I wanted to learn what it takes to charge for an AI feature, beyond making it work once.",
        did: [
          "Photo transformation with generative models",
          "A credit system: a profile on sign-up and credits deducted per generation",
          "Stripe checkout, webhooks and a customer portal",
          "A deployment pipeline that runs on every change",
        ],
        shows: "Metering, payments and a repeatable deployment matter as much as the model.",
        tags: ["TypeScript", "Appwrite", "Stripe", "GitHub Actions"],
      },
      {
        slug: "soraign",
        period: "2025",
        title: "Soraign",
        label: "AI video generation dashboard",
        status: "Web application",
        summary: "A private dashboard for generating video from text or images.",
        context:
          "Video generation takes minutes and fails often. I built a dashboard around that reality.",
        did: [
          "Text to video and image to video through a video generation API",
          "Live status tracking while a video renders",
          "Webhook handling with signature verification",
          "Sign-in with protected routes, on PostgreSQL",
        ],
        shows: "Long-running AI jobs need queues, status and failure handling as much as prompts.",
        tags: ["Next.js", "Prisma", "PostgreSQL", "Webhooks"],
      },
      {
        slug: "tattoo-previewer",
        period: "2025",
        title: "Tattoo Previewer",
        label: "AI image preview",
        status: "MVP",
        summary: "Shows a tattoo on your own photo before you commit to it.",
        context: "People struggle to imagine a design on their own skin.",
        did: [
          "Turns an inspiration image into a tattoo design in a chosen style",
          "Applies the design to a photo of the body, adapting to skin tone and lighting",
          "Size presets from small to extra large",
          "Accounts and saved previews",
        ],
        shows: "Image models are at their best when they help someone decide.",
        tags: ["React", "TypeScript", "Supabase", "Stable Diffusion"],
      },
      {
        slug: "bingus-geocoder",
        period: "2025",
        title: "Bingus Geocoder",
        label: "Batch geocoding with AI correction",
        status: "Prototype",
        summary:
          "Finds coordinates for a spreadsheet of addresses and uses AI to repair the ones that fail.",
        context:
          "Bulk address lookups always leave a pile of failures: typos, missing postcodes, odd formats.",
        did: [
          "Batch geocoding from an Excel file",
          "An AI step that corrects typos and incomplete addresses, then retries",
          "Drag-and-drop upload and progress tracking",
        ],
        shows:
          "A model is most useful at the edges of an ordinary automation, on the rows a fixed rule cannot handle.",
        tags: ["Python", "Flask", "Nominatim", "OpenAI API"],
      },
      {
        slug: "sitesync-pro",
        period: "2025",
        title: "SiteSync Pro",
        label: "Content retrieval utility",
        status: "Working tool",
        summary:
          "Retrieves and packages website content for migration and archiving, in place of repetitive manual work.",
        context: "Saving pages one by one before a migration takes hours and nobody enjoys it.",
        did: [
          "Signs in to a protected staging site and fetches pages in parallel",
          "Packages the HTML into a single ZIP file",
          "A job queue with status tracking",
        ],
        shows: "Not every time-saver needs a model. This one is plain automation.",
        tags: ["Python", "Flask", "Automation"],
      },
    ],
  },

  about: {
    title: ["Thomas ", "Nicoli", ""],
    rulesTitle: "Working rules",
  },
};
