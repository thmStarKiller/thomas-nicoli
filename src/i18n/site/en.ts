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
      text: "I help businesses and professionals put AI to work on the tasks that eat the week: enquiries, follow-ups and repetitive admin. Fixed prices, one useful step at a time, and you approve each one.",
      primary: "Request the €490 audit",
      secondary: "See what I do",
      caption: "Thomas Nicoli, Madrid",
      note: "Two projects at a time, by choice",
    },
    ticker: ["AI audits","Lead response","Admin automation","Website assistants","Reporting","Workshops","French content"],
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
          text: "Find the repetitive work, automate one piece of it, and stay in control.",
          meta: "Audit at €490, builds from €1,250",
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
            "The audit is €490, fixed. Builds are fixed-price too: most fall between €1,250 and €2,250 depending on the workflow, and you get the figure in writing before anything starts. Third-party costs, such as software subscriptions, are listed separately before you accept.",
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
      title: "AI for businesses: audit, automation and assistants at fixed prices",
      description:
        "A €490 AI Opportunity Audit, then fixed-price sprints for lead response, admin automation, website assistants and reporting. Madrid and remote, in Spanish, English or French.",
    },
    hero: {
      eyebrow: "For businesses",
      title: ["Less repetitive work, ", "one fixed-price step", " at a time."],
      intro:
        "For small and mid-sized businesses in and around Madrid, and remote teams elsewhere. We start with a short audit, build one thing that saves time, and only then decide whether to go further.",
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
        },
        {
          slug: "administrative-automation-sprint",
          name: "Administrative Automation Sprint",
          line: "One back-office workflow automated, tested and handed over.",
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
            "Between 7 and 20 business days depending on the sprint. The audit itself takes 3 to 5 business days after the kick-off.",
        },
        {
          question: "Are there extra costs?",
          answer:
            "Third-party costs, such as software subscriptions or model usage, are listed separately before you accept. Prices exclude VAT.",
        },
        {
          question: "Which businesses do you turn down?",
          answer:
            "Anything that needs medical, financial or legal data, plus gambling and adult businesses. I also avoid beauty and cosmetics accounts, to prevent any conflict of interest.",
        },
      ],
    },
  },

  professionals: {
    meta: {
      title: "AI for professionals and teams: practical workshops in Madrid and online",
      description:
        "Practical AI workshops for marketing, e-commerce and operations people, taught in Spanish, English or French. Also French e-commerce content and review of AI output for agencies.",
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
        { label: "Price", value: "Quoted per group. For schools, according to the centre's rate." },
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
            "It depends on the format and the size of the group. Tell me who it is for and I will send a fixed quote.",
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
        "More than ten years of digital commerce, content and platform work, and the AI tools Thomas Nicoli has designed and built himself. No invented clients and no borrowed results.",
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
