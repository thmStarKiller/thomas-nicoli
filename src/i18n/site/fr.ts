import type { SiteCopy } from "./types";

export const site: SiteCopy = {
  nav: {
    business: "Entreprises",
    professionals: "Professionnels",
    work: "Travaux",
    about: "À propos",
    contact: "Contact",
    clarity: "Project Clarity",
    index: "Sommaire",
  },
  cta: {
    contact: "Écrivez-moi",
    call: "Réserver un appel",
    callOption: "Un premier appel",
    callHint: "Indiquez-moi deux ou trois créneaux qui vous conviennent, heure de Madrid. Je vous en confirme un par email.",
    moreDetails: "Ajouter des détails (optionnel)",
    audit: "Demander l’audit",
    question: "Poser une question",
    reply: "Je réponds sous un jour ouvré",
  },
  labels: {
    price: "Prix",
    turnaround: "Délai",
    included: "Ce que vous recevez",
    notIncluded: "Non inclus",
    examples: "Flux habituels",
    context: "Contexte",
    did: "Ce que j’ai construit",
    shows: "Ce que cela montre",
    status: "Statut",
    tags: "Technologies",
    next: "Projet suivant",
    back: "Tous les travaux",
    tryIt: "L’essayer sur ce site",
    readCase: "Lire le cas",
    scroll: "Défiler",
    priceOnRequest: "Devis par groupe",
  },

  home: {
    hero: {
      label: "Consultant IA · Madrid",
      title: ["Une IA qui ", "mérite sa place", " dans votre activité."],
      text: "J’aide les entreprises et les professionnels à mettre l’IA au travail sur les tâches qui dévorent la semaine : demandes, relances et gestion répétitive. Des prix fixes, une étape utile à la fois, et vous validez chacune.",
      primary: "Réserver un appel",
      secondary: "Demander l’audit à 490 €",
      caption: "Thomas Nicoli, Madrid",
      note: "Deux projets à la fois, par choix",
    },
    ticker: ["Audits IA","Réponse aux demandes","Automatisation administrative","Assistants de site","Rapports","Réponses aux avis","Ateliers","Contenu en français"],
    facts: [
      { value: "10+", label: "ans dans le commerce digital et le contenu" },
      { value: "3", label: "langues de travail : français, anglais et espagnol" },
      { value: "490 €", label: "prix fixe de la première étape" },
      { value: "2", label: "projets à la fois, jamais plus" },
    ],
    doors: {
      eyebrow: "Commencer ici",
      title: "Par où voulez-vous commencer ?",
      items: [
        {
          numeral: "I",
          title: "Pour les entreprises",
          text: "Repérer le travail répétitif, en automatiser une partie et garder la main.",
          meta: "Audit à 490 €, réalisations dès 1 250 €",
          href: "/business",
        },
        {
          numeral: "II",
          title: "Pour les professionnels et les équipes",
          text: "Des ateliers d’où chacun repart avec l’une de ses tâches prise en charge par l’IA.",
          meta: "En ligne ou à Madrid",
          href: "/professionals",
        },
        {
          numeral: "III",
          title: "Pour les agences",
          text: "Contenu e-commerce en français, contrôle linguistique et relecture de textes produits par l’IA, facturés à l’heure.",
          meta: "Lots dès 48 heures",
          href: "/professionals#agencies",
        },
      ],
    },
    audit: {
      eyebrow: "La première étape",
      title: ["L’audit d’", "opportunités", " IA."],
      text: "Une revue courte, à prix fixe, qui vous indique où l’automatisation ferait gagner du temps à votre équipe, ce qu’elle coûterait à construire et ce qu’il vaut mieux laisser tel quel.",
      price: "490 €",
      priceNote: "prix fixe, hors TVA",
      timing: "Livré en 3 à 5 jours ouvrés",
      items: [
        "Une revue de votre site public et du parcours client, de la première demande à la réservation ou à l’achat",
        "Une carte des tâches répétitives et des points de friction, avec le temps que chacune prend aujourd’hui",
        "Une liste priorisée d’opportunités d’automatisation, chacune avec son effort, son risque et ses enjeux de données",
        "Une feuille de route d’une page pour la première qui mérite d’être construite",
        "Un appel de 45 minutes pour parcourir les conclusions",
      ],
      excluded:
        "Non inclus : la réalisation de l’automatisation, l’accès aux systèmes de production, les audits de sécurité et le conseil juridique.",
    },
    work: {
      eyebrow: "Travaux",
      title: ["Du travail réel, ", "décrit tel qu’il est.", ""],
      intro:
        "Plus de dix ans de commerce digital, et les outils d’IA que je construis pour vérifier ce qui tient en pratique. Aucun client inventé, aucun résultat emprunté.",
      cta: "Voir tous les travaux",
    },
    method: {
      eyebrow: "Ma façon de travailler",
      title: ["Un périmètre réduit, ", "écrit noir sur blanc,", " livré à la date prévue."],
      text: "Je suis Thomas Nicoli : français, installé à Madrid, et je travaille chaque jour en anglais et en espagnol. Je suis salarié sur des plateformes e-commerce et je prends des projets indépendants en dehors des heures de bureau.",
      rules: [
        "Deux projets à la fois, au maximum. Je confirme chaque date avant de m’engager.",
        "Un prix fixe et un périmètre écrit avant de commencer. Une série de corrections est incluse.",
        "Vous validez chaque étape avant sa mise en service. Je ne construis pas de systèmes totalement autonomes.",
        "Je ne demande jamais de mot de passe par email, et je supprime vos données de travail à la fin du projet, sauf si vous me demandez de les conserver.",
        "Pas de données médicales, financières ou juridiques. Si un projet n’est pas pour moi, je le dis tôt.",
      ],
      cta: "En savoir plus sur moi",
    },
    faq: {
      eyebrow: "Questions",
      title: "Ce que l’on me demande avant d’écrire.",
      items: [
        {
          question: "Combien ça coûte ?",
          answer:
            "L’audit coûte 490 €, prix fixe. Les réalisations sont à prix fixe elles aussi, de 6905€ pour les réponses aux avis à 252505€ pour un assistant de site, et vous recevez le montant par écrit avant le début du travail. Les coûts tiers, comme les abonnements logiciels, sont indiqués à part avant votre accord.",
        },
        {
          question: "L’IA agira-t-elle sans moi ?",
          answer:
            "Non. Chaque automatisation prévoit un passage de relais à une personne, et vous validez chaque étape avant sa mise en service. Je ne mets pas en place de systèmes totalement autonomes.",
        },
        {
          question: "Que deviennent mes données ?",
          answer:
            "Nous convenons de ce que chaque outil peut voir avant de connecter quoi que ce soit. Je ne demande jamais de mot de passe par email, je ne travaille pas avec des données médicales, financières ou juridiques, et je supprime les données de travail à la fin du projet, sauf si vous me demandez de les conserver.",
        },
        {
          question: "Et si l’IA n’est pas la bonne réponse ?",
          answer:
            "L’audit le dira. Une partie du travail consiste à vous indiquer ce qu’il vaut mieux laisser tel quel, ou les cas où une automatisation simple, à base de règles, fait mieux qu’un modèle.",
        },
        {
          question: "Faut-il des connaissances techniques ?",
          answer:
            "Non. Vous décrivez la tâche avec vos mots. Je m’occupe de la mise en place et je laisse un guide écrit pour la personne qui s’en servira.",
        },
        {
          question: "Est-ce votre activité à plein temps ?",
          answer:
            "Non. Le jour, je suis salarié sur des plateformes e-commerce, et je prends des projets indépendants en dehors des heures de bureau, entièrement séparés de ce poste. C’est pourquoi je prends deux projets au maximum et je confirme chaque date avant de m’engager.",
        },
        {
          question: "Où travaillez-vous ?",
          answer:
            "Je suis installé à Madrid et je travaille avec des entreprises de la ville et de ses environs, et à distance ailleurs, en français, anglais ou espagnol.",
        },
      ],
    },
    final: {
      title: ["Dites-moi ce qui ", "dévore votre semaine.", ""],
      text: "Écrivez-moi quelques lignes sur la tâche qui revient sans cesse. Je réponds sous un jour ouvré, en général le soir, heure de Madrid.",
      linkedin: "LinkedIn",
      clarity: "Vous préférez d’abord l’écrire ? Répondez à six questions dans Project Clarity.",
    },
  },

  business: {
    meta: {
      title: "IA en entreprise : audit et automatisation",
      description:
        "Un audit d’opportunités IA à 490 €, puis des sprints à prix fixe : réponse aux demandes, tâches administratives, assistants de site, rapports.",
    },
    hero: {
      eyebrow: "Pour les entreprises",
      title: ["Moins de travail répétitif, ", "une étape à prix fixe", " à la fois."],
      intro:
        "Pour les petites et moyennes entreprises de Madrid et de ses environs, et les équipes à distance ailleurs. Nous commençons par un audit court, nous construisons une chose qui fait gagner du temps, et alors seulement nous décidons d’aller plus loin.",
    },
    signals: {
      eyebrow: "Les signes qui méritent un regard",
      title: "Est-ce que cela vous parle ?",
      items: [
        "Les demandes arrivent par email, par téléphone et par formulaire, et personne ne sait vraiment lesquelles ont reçu une réponse.",
        "Les devis, les réservations ou les documents sont préparés à la main, un par un.",
        "Les informations sont recopiées des emails vers des tableurs.",
        "Un message arrivé hors horaires ne reçoit aucun accusé de réception avant le lendemain.",
        "Les clients écrivent dans plusieurs langues, et les réponses dans la seconde prennent plus de temps.",
        "Les mêmes questions reçoivent les mêmes réponses chaque semaine.",
        "Les avis Google attendent des jours une réponse, et certains sont dans des langues que personne dans l’équipe n’écrit.",
      ],
    },
    steps: [
      {
        numeral: "I",
        name: "Audit",
        text: "Une revue à prix fixe de ce que l’automatisation ferait gagner, et de ce qu’il vaut mieux laisser.",
      },
      {
        numeral: "II",
        name: "Construire une chose",
        text: "Un flux convenu, construit, testé et transmis à prix fixe.",
      },
      {
        numeral: "III",
        name: "Le faire durer",
        text: "Un accompagnement mensuel optionnel pour le suivi et les petits ajustements.",
      },
    ],
    build: {
      eyebrow: "Étape II",
      title: ["Construire ", "une chose", " qui fait gagner du temps."],
      intro:
        "Chaque sprint couvre un flux convenu, avec des tests, un passage de relais à une personne et un guide de passation. Le prix est confirmé par écrit avant le début du travail.",
      offers: [
        {
          slug: "ai-lead-response-sprint",
          name: "Sprint de réponse aux demandes avec l’IA",
          line: "Chaque demande reçoit un accusé de réception, est triée et résumée, avec une personne dans la boucle.",
          price: "1 500 €",
          priceNote: "prix fixe habituel",
          turnaround: "7 à 14 jours ouvrés",
          deliverables: [
            "Accusé de réception automatique de chaque demande",
            "Règles de tri et de qualification des contacts",
            "Réponses validées aux questions fréquentes, avec passage de relais à une personne",
            "Résumés structurés des contacts, tests et notes de passation",
          ],
          examples:
            "Demandes par email, formulaire web ou WhatsApp Business, pour les agences immobilières, les écoles de langues, les organisateurs de visites et les petits hôtels. Les frais de messages WhatsApp facturés par Meta sont indiqués à part.",
        },
        {
          slug: "administrative-automation-sprint",
          name: "Sprint d’automatisation administrative",
          line: "Un flux de back-office automatisé, testé et transmis.",
          price: "1 650 €",
          priceNote: "prix fixe habituel",
          turnaround: "7 à 14 jours ouvrés",
          deliverables: [
            "Un flux convenu, spécifié par écrit",
            "Une automatisation en service ou une preuve de concept",
            "Tests, gestion des exceptions et passage de relais à une personne",
            "Un guide de passation et une séance de transmission",
          ],
          examples:
            "Tri de la boîte de réception, brouillons de réponse, routage de documents, extraction de données, mise à jour de tableurs, résumés de réunions, demandes de devis.",
        },
        {
          slug: "multilingual-ai-website-assistant",
          name: "Assistant de site multilingue avec l’IA",
          line: "Un assistant sur votre site qui répond à partir du contenu que vous validez, en espagnol et en anglais, avec le français en option.",
          price: "2 250 €",
          priceNote: "prix fixe habituel",
          turnaround: "10 à 20 jours ouvrés",
          deliverables: [
            "Une base de connaissances construite à partir de votre contenu validé",
            "Espagnol et anglais, avec le français en option",
            "Réponses aux questions fréquentes, collecte de contacts et renvoi vers la réservation ou le contact",
            "Règles d’escalade, tests et documentation",
            "Indique clairement qu’il s’agit d’une IA et passe la main à une personne sur demande",
          ],
        },
        {
          slug: "ai-reporting-content-system",
          name: "Système de rapports et de contenus avec l’IA",
          line: "Des rapports et des contenus récurrents préparés pour que vous les relisiez et les envoyiez.",
          price: "1 250 €",
          priceNote: "prix fixe habituel",
          turnaround: "7 à 14 jours ouvrés",
          deliverables: [
            "Préparation automatique de rapports ou consolidation de données",
            "Modèles de synthèse et de contenus réutilisables",
            "Une étape de contrôle qualité et de validation humaine",
            "Spécification de la planification, tests et documentation",
          ],
        },
        {
          slug: "review-reply-assistant",
          name: "Assistant de réponse aux avis",
          line: "Chaque avis Google reçoit une réponse dans la langue de son auteur et avec votre ton, et vous validez chaque réponse.",
          price: "690 €",
          priceNote: "prix fixe habituel",
          turnaround: "5 à 7 jours ouvrés",
          deliverables: [
            "Un récapitulatif des nouveaux avis, chaque jour ou chaque semaine",
            "Des brouillons de réponse dans la langue de chaque client, avec le ton de votre entreprise",
            "Vous validez, modifiez et publiez chaque réponse : rien n’est publié sans vous",
            "Une synthèse mensuelle des compliments et des reproches qui reviennent",
          ],
          examples:
            "Réponses aux avis Google pour les hôtels et locations de courte durée, les restaurants, les organisateurs de visites, les écoles de langues et les boutiques avec une clientèle étrangère.",
        },
      ],
    },
    support: {
      eyebrow: "Étape III",
      title: "Accompagnement mensuel et optimisation.",
      text: "Trois heures par mois de suivi, d’amélioration des prompts et des règles, de petits ajustements et un rapport court.",
      price: "290 €",
      priceNote: "par mois",
      custom: "Autre chose en tête ? Les projets sur mesure vont de 650 € à 3 500 €, toujours avec un périmètre écrit.",
    },
    limits: {
      eyebrow: "Limites",
      title: "Ce que je ne prends pas.",
      items: [
        "L’exploitation 24 h/24 ou les astreintes hors horaires",
        "Les données médicales, financières, juridiques ou autrement réglementées",
        "Les révisions illimitées ou l’assistance sans limite",
        "Les promesses de chiffre d’affaires garanti",
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Avant de demander l’audit.",
      items: [
        {
          question: "Le premier appel est-il gratuit ?",
          answer:
            "Oui. L’appel de présentation est gratuit et dure 30 minutes en visio, du lundi au mercredi en soirée. On regarde s’il y a quelque chose qui vaut la peine d’être automatisé, et vous repartez avec une réponse claire, quelle qu’elle soit.",
        },
        {
          question: "De quoi avez-vous besoin pour l’audit ?",
          answer:
            "D’un appel de lancement de 30 minutes, un soir de semaine ou à l’heure du déjeuner, et de réponses franches sur la façon dont le travail se fait aujourd’hui. Je n’ai pas besoin d’accéder à vos systèmes.",
        },
        {
          question: "Dois-je faire construire quelque chose après l’audit ?",
          answer:
            "Non. L’audit se suffit à lui-même. Vous gardez la carte des tâches, les priorités et la feuille de route, que nous retravaillions ensemble ou non.",
        },
        {
          question: "Combien de temps prend une réalisation ?",
          answer:
            "Entre 5 et 20 jours ouvrés selon la réalisation. L’audit lui-même prend 3 à 5 jours ouvrés après l’appel de lancement.",
        },
        {
          question: "Y a-t-il des coûts supplémentaires ?",
          answer:
            "Les coûts tiers, comme les abonnements logiciels ou l’usage des modèles, sont indiqués à part avant votre accord. Les prix s’entendent hors TVA.",
        },
        {
          question: "Et si l’IA se trompe ?",
          answer:
            "Elle ne répond qu’à partir des contenus que vous validez, ce dont elle n’est pas sûre part vers une personne, et vous validez chaque étape avant la mise en service. Chaque réalisation est testée sur des exemples réels avant la livraison, et les assistants indiquent clairement qu’ils sont une IA.",
        },
        {
          question: "Quelles entreprises refusez-vous ?",
          answer:
            "Tout projet qui exige des données médicales, financières ou juridiques, ainsi que les jeux d’argent et les activités pour adultes. J’évite aussi les comptes beauté et cosmétique, pour prévenir tout conflit d’intérêts.",
        },
      ],
    },
  },

  professionals: {
    meta: {
      title: "Ateliers IA pour professionnels et équipes",
      description:
        "Ateliers pratiques d’IA pour le marketing, l’e-commerce et les opérations, en français, anglais ou espagnol. Et du contenu e-commerce pour les agences.",
    },
    hero: {
      eyebrow: "Pour les professionnels et les équipes",
      title: ["Repartez avec l’une de ", "vos propres tâches", " prise en charge par l’IA."],
      intro:
        "Des séances pratiques pour les personnes du marketing, de l’e-commerce et des opérations qui ont déjà essayé les outils et veulent des résultats fiables. Animées par quelqu’un qui fait ce travail chaque jour, en français, anglais ou espagnol.",
    },
    modules: [
      {
        numeral: "A",
        title: "L’IA pratique pour les équipes marketing et e-commerce",
        duration: "Module de 6 à 10 heures, ou atelier de 3 heures",
        objective:
          "Chaque participant termine avec une tâche répétitive de son travail résolue avec l’IA, et sait juger si le résultat est fiable.",
        contents: [
          "Où l’IA fait gagner du temps et où elle en fait perdre : comment choisir la tâche",
          "Méthodes de travail : résumés de fils de discussion, relecture de contenu, briefs et documentation",
          "Qualité, données et confidentialité : ce que l’on ne colle jamais dans un outil, et comment vérifier ce qu’il renvoie",
          "Atelier : chacun automatise une tâche qui lui est propre et la présente avec un avant et un après",
        ],
        note: "J’utilise ces outils chaque jour pour résumer, relire du contenu et documenter, et j’enseigne cet usage concret, avec ses limites.",
      },
      {
        numeral: "B",
        title: "Faire tourner un e-commerce D2C sur plusieurs marchés",
        duration: "Module de 8 à 12 heures, ou masterclass de 2 heures",
        objective:
          "Les participants savent planifier et valider un lancement sur un nouveau marché, du besoin au jour J.",
        contents: [
          "Anatomie d’une plateforme D2C : catalogue, contenu, promotions, paiement et CRM, et qui est responsable de chaque partie",
          "Du brief au lancement : des exigences claires, des tests de recette et une passation que quelqu’un d’autre peut utiliser",
          "La localisation en pratique : langues, prix, mentions légales et calendrier commercial de chaque pays",
          "Emails transactionnels et parcours client : ce qui est envoyé, quand, et comment on le vérifie",
          "Mesurer et décider : l’entonnoir, les indicateurs et le rapport mensuel que l’on lit vraiment",
        ],
        note: "Cas final : le lancement d’une marque fictive en France et en Espagne.",
      },
      {
        numeral: "C",
        slug: "ai-starter",
        title: "Démarrage IA pour petites équipes",
        duration: "Une séance de 2 heures jusqu’à 10 personnes · 450 €",
        objective:
          "Votre équipe convient des outils d’IA à utiliser, avec quelles données et comment vérifier ce qu’ils renvoient, et vous en gardez une trace écrite.",
        contents: [
          "Quelles tâches de votre entreprise valent la peine d’être confiées à l’IA, et lesquelles non",
          "Ce qui n’entre jamais dans un outil : données clients, mots de passe, documents confidentiels",
          "Comment vérifier une réponse d’IA avant qu’elle n’arrive à un client",
          "Une charte d’utilisation de l’IA d’une page, écrite pour votre équipe, et une feuille de présence",
        ],
        note: "Une formation pratique et une charte d’utilisation, pas un conseil juridique. Le règlement européen sur l’IA demande aux entreprises qui utilisent l’IA d’aider leur personnel à la comprendre ; c’est une manière simple et documentée de commencer.",
      },
    ],
    practical: {
      eyebrow: "En pratique",
      title: "Comment se déroulent les séances.",
      items: [
        { label: "Formats", value: "Atelier, module, masterclass ou tutorat de mémoires pour les écoles" },
        { label: "Où", value: "En ligne ou à Madrid" },
        { label: "Quand", value: "En direct du lundi au mercredi soir, ou en ligne à votre rythme" },
        { label: "Langues", value: "Français, anglais ou espagnol" },
        { label: "Cas", value: "Tous les cas étudiés portent sur des entreprises fictives. Aucune information d’un employeur ou d’un client n’est utilisée." },
        { label: "Prix", value: "Atelier de 3 heures : 750 € par groupe jusqu’à 12 personnes. Module de 6 à 10 heures : à partir de 1 800 € par groupe. Démarrage IA pour petites équipes : 450 €. Écoles : selon le tarif de l’établissement. Prix hors TVA." },
      ],
    },
    agencies: {
      eyebrow: "Pour les agences",
      title: ["Du contenu e-commerce en français, ", "relu par quelqu’un", " qui tient la boutique."],
      intro:
        "Contenu, SEO et qualité linguistique en français natif pour le commerce en ligne, facturés à l’heure. Je travaille de l’anglais et de l’espagnol vers le français, et je vérifie comment les textes se comportent sur une page réelle autant que la façon dont ils se lisent.",
      services: [
        {
          name: "SEO multilingue en français",
          text: "Recherche et cartographie de mots-clés, textes on-page, titres et méta-descriptions, et localisation de briefs SEO rédigés en anglais ou en espagnol.",
        },
        {
          name: "Rédaction e-commerce et transcréation",
          text: "Pages produit et catégorie, pages de campagne, emails CRM, push et SMS, écrits pour le marché français à partir d’une source en anglais ou en espagnol.",
        },
        {
          name: "Contrôle linguistique et relecture en contexte",
          text: "Relecture sur les sites de préproduction, les rendus d’emails et les chaînes d’interface, avec un journal d’anomalies classées par gravité que votre équipe peut traiter sans appel.",
        },
        {
          name: "Relecture et adaptation de textes produits par l’IA",
          text: "Contrôle qualité de contenus français traduits automatiquement ou générés par l’IA, selon un guide de style, avec des retours sur le glossaire et les prompts.",
        },
        {
          name: "Entraînement et évaluation d’IA en français",
          text: "Notation, réécriture et évaluation selon une grille de réponses de modèles sur le marketing, le retail et l’e-commerce.",
        },
      ],
      howTitle: "Ma façon de travailler avec les agences",
      how: [
        "Des lots asynchrones, avec un délai à partir de 48 heures",
        "Facturation à l’heure ou à la journée, sur devis par projet",
        "Accords de confidentialité et référencement fournisseur bienvenus",
        "Je n’accepte que les délais que je suis certain de tenir",
      ],
      notTitle: "Ce que je ne prends pas",
      not: [
        "La traduction au mot ou la post-édition au tarif au mot",
        "Les urgences pour le jour même ou l’astreinte aux heures de bureau",
        "Les comptes beauté et cosmétique, pour éviter tout conflit d’intérêts",
      ],
      cta: "Demander la fiche de services",
    },
    faq: {
      eyebrow: "Questions",
      title: "Avant de réserver une séance.",
      items: [
        {
          question: "À qui s’adressent les séances ?",
          answer:
            "Aux personnes du marketing, de l’e-commerce, du contenu et des opérations qui utilisent déjà un assistant de temps en temps et veulent une méthode. Aucun bagage technique n’est nécessaire.",
        },
        {
          question: "Pouvez-vous former une équipe en entreprise ?",
          answer:
            "Oui. L’atelier est construit autour des tâches réelles de l’équipe, et j’utilise des données fictives lorsque les documents réels sont confidentiels.",
        },
        {
          question: "Combien ça coûte ?",
          answer:
            "Un atelier de 3 heures coûte 750 € pour un groupe jusqu’à 12 personnes, et un module de 6 à 10 heures à partir de 1 800 € par groupe. Le démarrage IA pour petites équipes coûte 450 €. Prix hors TVA, avec un devis fixe avant toute réservation.",
        },
        {
          question: "Doit-on former le personnel à cause du règlement européen sur l’IA ?",
          answer:
            "Le règlement européen sur l’IA demande aux entreprises qui utilisent l’IA de prendre des mesures pour que leur personnel la comprenne suffisamment. Il n’impose ni certificat ni format de cours. Une séance courte avec une charte d’utilisation écrite est un premier pas pratique et documenté. Pour une lecture juridique de votre cas, consultez un avocat.",
        },
        {
          question: "La formation peut-elle être financée par la FUNDAE (Espagne) ?",
          answer:
            "Si votre entreprise gère son crédit de formation FUNDAE, elle peut organiser le cours et m’engager comme formateur. Pour les très petites entreprises, le crédit est limité : vérifiez d’abord le montant avec votre gestoría.",
        },
        {
          question: "Intervenez-vous dans les écoles ?",
          answer:
            "Oui, comme intervenant pour une masterclass, un module complet ou le tutorat de mémoires, en français, espagnol ou anglais.",
        },
      ],
    },
  },

  work: {
    meta: {
      title: "Travaux : expérience et réalisations",
      description:
        "Plus de dix ans de commerce digital et de contenu, et les outils d’IA que Thomas Nicoli a construits. Aucun client inventé, aucun résultat emprunté.",
    },
    hero: {
      eyebrow: "Travaux",
      title: ["Du travail réel, ", "décrit tel qu’il est.", ""],
      intro:
        "Deux types de preuves. L’expérience : plus de dix ans de commerce digital, de contenu et de plateformes. Les réalisations : des outils d’IA que j’ai conçus et construits moi-même pour vérifier ce qui tient. Aucun employeur n’est nommé et aucun résultat client n’est revendiqué.",
    },
    experience: {
      eyebrow: "Expérience",
      title: "Dix ans, trois chapitres.",
      note: "Tiré de mon CV. Mon employeur actuel n’est pas nommé, et aucune information interne ne figure sur ce site.",
      items: [
        {
          period: "Depuis 2023",
          title: "Plateformes e-commerce D2C pour les marchés européens",
          label: "En interne",
          text: "Exploitation quotidienne de boutiques en ligne de vente directe au consommateur pour plusieurs pays européens : contenu, promotions, emails transactionnels et marketing, localisation et tests avant chaque mise en ligne.",
        },
        {
          period: "Avant 2023",
          title: "Un portefeuille de 16 sites en 5 langues",
          label: "Agence digitale",
          text: "En agence digitale, j’ai géré un portefeuille de seize sites web en cinq langues.",
        },
        {
          period: "2017 à 2022",
          title: "SEO multilingue et traduction",
          label: "Indépendant, sous le nom Metamorphoses Consulting",
          text: "Spécialiste SEO multilingue et traducteur indépendant pour des agences linguistiques et de référencement, dont TransPerfect, Travod et Webcertain.",
        },
      ],
    },
    education: {
      label: "Formation",
      text: "Master en Management interculturel, Marketing et Traduction, ISIT Paris.",
    },
    agenciesLine: {
      label: "Agences pour lesquelles j’ai travaillé en indépendant",
      names: ["TransPerfect", "Travod", "Webcertain"],
    },
    builds: {
      eyebrow: "Réalisations",
      title: "Ce que j’ai construit pour voir ce qui marche.",
      note: "Des projets menés de ma propre initiative, chacun né d’une friction précise. Ce sont des prototypes et des outils en service, montrés au stade qu’ils ont atteint.",
    },
    cases: [
      {
        slug: "site-chat",
        period: "2026",
        title: "Le chat de ce site",
        label: "Assistant IA de site web",
        status: "Fait partie de ce site",
        summary:
          "Il répond aux questions sur mes services avec un modèle Nemotron hébergé par NVIDIA, et un modèle open source local en secours.",
        context:
          "Je voulais un assistant de site qui réponde en quelques secondes, s’en tienne à ce que j’ai publié et me dise ce que les gens demandent.",
        did: [
          "Chaque message et un contexte récent limité sont conservés chez Cloudflare et envoyés à l’API de NVIDIA",
          "Le modèle Nemotron 3.5 Super VL rédige la réponse à partir des offres et des prix publiés sur ce site",
          "Si ce service ne répond pas, le message attend dans une file sécurisée et un modèle Gemma, exécuté en local avec Ollama sur mon ordinateur, y répond",
          "Après chaque tour traité, je reçois un résumé par email",
          "Les sessions sont anonymes, protégées par Turnstile et limitées à deux heures et douze tours",
          "Les messages sont conservés 30 jours et supprimés plus tôt sur demande",
        ],
        shows:
          "Un assistant peut répondre vite avec un modèle hébergé et garder un modèle privé en réserve. La clé reste sur le serveur et le visiteur sait quel fournisseur répond.",
        tags: ["Nemotron", "NVIDIA API", "Gemma", "Ollama", "Cloudflare Pages Functions", "D1", "Turnstile", "Resend"],
      },
      {
        slug: "project-clarity",
        period: "2026",
        title: "Project Clarity",
        label: "Diagnostic assisté par IA",
        status: "Fait partie de ce site",
        summary:
          "Six questions sur un projet, une première lecture par un modèle local et une relecture humaine avant toute réponse.",
        context:
          "La plupart des premiers échanges partent d’un brief flou. Je voulais que l’on puisse décrire correctement le problème avant de se parler, sans chatbot qui improvise des réponses.",
        did: [
          "Six questions sur le type de projet, le blocage, les systèmes existants, le résultat qui en vaut la peine, les contraintes et la langue",
          "La demande attend dans une file sécurisée, même lorsque mon ordinateur est éteint",
          "Un modèle Gemma fait une première lecture en local, à partir de champs assainis uniquement",
          "Je relis le rapport et chaque brouillon avant de répondre, et rien n’est envoyé de façon autonome",
          "Conservation de 30 jours, avec suppression anticipée sur demande",
        ],
        shows: "Un modèle peut préparer le travail pendant qu’une personne reste responsable de la réponse.",
        tags: ["Gemma", "Inférence locale", "Relecture humaine", "Trois langues"],
        href: "/project-clarity",
      },
      {
        slug: "sfcc-inspector",
        period: "2026",
        title: "SFCC Inspector",
        label: "Le code expliqué aux non-développeurs",
        status: "Preuve de concept",
        summary:
          "Un explorateur assisté par IA qui explique le code Salesforce Commerce Cloud en langage clair.",
        context:
          "Sur les plateformes de commerce, les équipes métier dépendent d’un code qu’elles ne peuvent pas lire. Une question simple sur le fonctionnement d’un réglage peut attendre un développeur pendant des jours.",
        did: [
          "Un explorateur de fichiers pour les cartouches d’un site marchand, avec recherche en texte intégral",
          "Des résumés qui expliquent ce que fait un fichier et pourquoi, en langage clair",
          "Des questions et réponses sur le code en langage naturel",
          "La détection de motifs propres à la plateforme, comme les hooks et les préférences",
          "Un mode bureau et un mode cloud, avec le choix du fournisseur d’IA",
        ],
        shows:
          "L’écart entre les équipes métier et techniques est souvent un problème de traduction, et un modèle traduit bien lorsque quelqu’un conçoit les questions.",
        tags: ["React", "FastAPI", "Google Gemini", "WebDAV"],
      },
      {
        slug: "starcandidate",
        period: "2026",
        title: "STARCandidate",
        label: "Plateforme d’adaptation de CV",
        status: "Application web",
        summary: "Adapte un CV à une offre d’emploi, avec des modèles et des portraits générés par IA.",
        context:
          "Chercher un emploi, c’est réécrire le même CV pour chaque annonce. J’ai construit un outil qui fait le premier jet.",
        did: [
          "Une analyse du CV qui l’adapte à une offre donnée",
          "Un studio de portraits qui produit une photo professionnelle à partir d’un selfie",
          "Un ensemble de modèles de CV",
          "Des comptes, un tableau de bord d’administration et des fonctions serverless",
        ],
        shows:
          "Un produit complet autour d’un modèle : les comptes, l’administration et les parties peu glamour qui rendent une fonction d’IA utilisable.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Appwrite"],
      },
      {
        slug: "bandersnatch-ai",
        period: "2026",
        title: "Bandersnatch AI",
        label: "Transformation créative de photos",
        status: "Application web",
        summary: "Transforme des photos avec l’IA générative, avec crédits et paiements.",
        context:
          "Je voulais apprendre ce qu’il faut pour faire payer une fonction d’IA, au-delà de la faire marcher une fois.",
        did: [
          "Transformation de photos avec des modèles génératifs",
          "Un système de crédits : un profil à l’inscription et des crédits déduits à chaque génération",
          "Paiement Stripe, webhooks et portail client",
          "Un déploiement automatique à chaque modification",
        ],
        shows: "Le comptage, les paiements et un déploiement reproductible comptent autant que le modèle.",
        tags: ["TypeScript", "Appwrite", "Stripe", "GitHub Actions"],
      },
      {
        slug: "soraign",
        period: "2025",
        title: "Soraign",
        label: "Tableau de bord de génération vidéo par IA",
        status: "Application web",
        summary: "Un tableau de bord privé pour générer des vidéos à partir de texte ou d’images.",
        context:
          "Générer une vidéo prend des minutes et échoue souvent. J’ai construit un tableau de bord pensé pour cette réalité.",
        did: [
          "Du texte à la vidéo et de l’image à la vidéo via une API de génération vidéo",
          "Un suivi d’état en direct pendant le rendu d’une vidéo",
          "La gestion des webhooks avec vérification de signature",
          "Une connexion avec des routes protégées, sur PostgreSQL",
        ],
        shows:
          "Les tâches d’IA longues ont autant besoin de files d’attente, d’états et de gestion des échecs que de prompts.",
        tags: ["Next.js", "Prisma", "PostgreSQL", "Webhooks"],
      },
      {
        slug: "tattoo-previewer",
        period: "2025",
        title: "Tattoo Previewer",
        label: "Aperçu d’image par IA",
        status: "MVP",
        summary: "Montre un tatouage sur votre propre photo avant de vous décider.",
        context: "On a du mal à imaginer un motif sur sa propre peau.",
        did: [
          "Transforme une image d’inspiration en motif de tatouage dans le style choisi",
          "Applique le motif sur une photo du corps, en s’adaptant au teint et à la lumière",
          "Des tailles prédéfinies, de petit à très grand",
          "Des comptes et des aperçus enregistrés",
        ],
        shows: "Les modèles d’image donnent le meilleur d’eux-mêmes quand ils aident quelqu’un à décider.",
        tags: ["React", "TypeScript", "Supabase", "Stable Diffusion"],
      },
      {
        slug: "bingus-geocoder",
        period: "2025",
        title: "Bingus Geocoder",
        label: "Géocodage par lots avec correction par IA",
        status: "Prototype",
        summary:
          "Trouve les coordonnées d’un tableur d’adresses et utilise l’IA pour réparer celles qui échouent.",
        context:
          "Les recherches d’adresses en masse laissent toujours un tas d’échecs : fautes de frappe, codes postaux manquants, formats étranges.",
        did: [
          "Géocodage par lots à partir d’un fichier Excel",
          "Une étape d’IA qui corrige les fautes et les adresses incomplètes, puis réessaie",
          "Dépôt du fichier par glisser-déposer et suivi de la progression",
        ],
        shows:
          "Un modèle est le plus utile aux marges d’une automatisation ordinaire, sur les lignes qu’une règle fixe ne sait pas traiter.",
        tags: ["Python", "Flask", "Nominatim", "OpenAI API"],
      },
      {
        slug: "sitesync-pro",
        period: "2025",
        title: "SiteSync Pro",
        label: "Utilitaire de récupération de contenu",
        status: "Outil en service",
        summary:
          "Récupère et prépare le contenu d’un site pour une migration ou un archivage, à la place d’un travail manuel répétitif.",
        context:
          "Enregistrer les pages une à une avant une migration prend des heures et n’amuse personne.",
        did: [
          "Se connecte à un site de préproduction protégé et récupère les pages en parallèle",
          "Regroupe le HTML dans un seul fichier ZIP",
          "Une file de tâches avec suivi d’état",
        ],
        shows: "Tout ce qui fait gagner du temps n’a pas besoin d’un modèle. Ici, c’est de l’automatisation simple.",
        tags: ["Python", "Flask", "Automatisation"],
      },
    ],
  },

  about: {
    title: ["Thomas ", "Nicoli", ""],
    rulesTitle: "Règles de travail",
  },
};
