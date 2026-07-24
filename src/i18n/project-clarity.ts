import type { Locale } from "./config";

const copy = {
  es: {
    nav: "Project Clarity",
    buyerPaths: [
      {
        id: "independent",
        title: "Para negocios independientes",
        text: "Webs enfocadas, visibilidad local, bases de contenido y automatización de un flujo concreto.",
        cta: "Aclarar mi proyecto",
      },
      {
        id: "digital-team",
        title: "Para equipos digitales",
        text: "Diagnóstico de e-commerce y CRM, alineación entre responsables, soporte de entrega, operaciones de plataforma, QA y traspaso.",
        cta: "Aclarar el siguiente paso",
      },
    ],
    contact: {
      website: "Web actual o URL relevante (opcional)",
      websitePlaceholder: "https://tu-sitio.com",
      timing: "Plazo deseado (opcional)",
      timingPlaceholder: "Elige una opción",
      timingOptions: ["Lo antes posible", "Entre uno y tres meses", "Entre tres y seis meses", "Solo estoy explorando"],
      location: "Ciudad / país (opcional)",
      locationPlaceholder: "Madrid, España",
      privacyBefore: "He leído la",
      privacyLink: "política de privacidad",
      privacyAfter: "y acepto el uso de mis datos para responder.",
      turnstile: "Esta consulta está protegida por Cloudflare Turnstile.",
      noJs: "¿JavaScript no está disponible? Usa el contacto sencillo por email.",
      emailCta: "Escribir a bonjour@thomas-nicoli.com",
      websiteError: "Introduce una URL http o https válida.",
    },
    clarity: {
      eyebrow: "Project Clarity",
      title: "Aclarar el proyecto antes de construir.",
      intro: "Seis preguntas para ordenar el bloqueo, el contexto y el resultado que merece la pena. No es un chatbot ni una respuesta instantánea.",
      asyncNote: "La solicitud queda en una cola segura aunque mi ordenador esté apagado. Una primera lectura asistida por Gemma se ejecuta localmente más tarde; yo reviso el informe y cualquier borrador antes de responder.",
      signalStages: ["Contexto", "Cola segura", "Gemma local", "Revisión humana"],
      progress: "Pregunta {current} de 6",
      stepAnnouncement: "Pregunta {current} de 6: {title}",
      questions: [
        { title: "¿Eres un negocio independiente, un equipo digital o aún no lo sabes?", hint: "Elige la opción que mejor describa el contexto actual." },
        { title: "¿Qué se está atascando ahora?", hint: "Describe el bloqueo observable, no una solución que ya hayas decidido." },
        { title: "¿Qué sistemas o activos existen ya?", hint: "Web, e-commerce, CRM, contenido, analítica, procesos o documentación." },
        { title: "¿Qué resultado observable haría que el proyecto mereciera la pena?", hint: "Una señal concreta que pueda revisarse, sin promesas de métricas." },
        { title: "¿Qué plazo o restricción importa?", hint: "Fecha, dependencia, presupuesto, capacidad interna o requisito técnico." },
        { title: "¿En qué idioma debería llegar la respuesta?", hint: "La respuesta revisada será en español, inglés o francés." },
      ],
      buyerOptions: ["Negocio independiente", "Equipo digital", "Aún no lo sé"],
      fieldPlaceholders: ["Por ejemplo: la web no convierte las visitas en consultas…", "Por ejemplo: Shopify, SFCC, HubSpot, contenidos, hojas de cálculo…", "Por ejemplo: que el equipo pueda decidir el alcance y el siguiente paso…", "Por ejemplo: lanzamiento en octubre, equipo pequeño, dependencia del CRM…"],
      languageOptions: ["Español", "English", "Français"],
      next: "Siguiente",
      back: "Atrás",
      detailsTitle: "Dónde enviar la respuesta revisada",
      detailsIntro: "Estos datos no forman parte de las seis preguntas de diagnóstico.",
      name: "Nombre",
      email: "Email",
      website: "Web o URL relevante (opcional)",
      location: "Ciudad / país (opcional)",
      consentPending: "Acepto que Thomas Nicoli trate estos datos para analizar mi solicitud y responderme. Conservación prevista: 30 días, salvo que solicite su eliminación antes.",
      turnstileError: "Completa la verificación de seguridad antes de enviar.",
      checkpointTitle: "Preview de ingeniería — recepción desactivada",
      checkpointText: "El recorrido puede revisarse, pero ninguna solicitud se almacena mientras falten los datos legales y el texto de conservación aprobados.",
      submit: "Enviar diagnóstico",
      submitting: "Guardando de forma segura…",
      alternative: "¿Prefieres una vía sencilla? Usa el formulario de contacto normal.",
      contactCta: "Ir a contacto",
      confirmationTitle: "Solicitud recibida",
      confirmationText: "Tu información quedó en cola. La primera lectura asistida por IA será local y asincrónica; Thomas la revisará antes de responder.",
      reference: "Referencia",
      summaryTitle: "Resumen enviado",
      duplicate: "Esta solicitud ya estaba en cola; se conserva la misma referencia.",
      error: "No se pudo guardar la solicitud. Usa el contacto normal o inténtalo más tarde.",
      validation: "Revisa el campo marcado antes de continuar.",
      privacyLink: "Leer la política de privacidad",
    },
  },
  en: {
    nav: "Project Clarity",
    buyerPaths: [
      { id: "independent", title: "For independent businesses", text: "Focused websites, local visibility, content foundations and automation of one specific workflow.", cta: "Clarify my project" },
      { id: "digital-team", title: "For digital teams", text: "E-commerce and CRM diagnosis, stakeholder alignment, delivery support, platform operations, QA and handover.", cta: "Clarify the next step" },
    ],
    contact: {
      website: "Current website or relevant URL (optional)", websitePlaceholder: "https://your-site.com", timing: "Desired timing (optional)", timingPlaceholder: "Choose an option", timingOptions: ["As soon as possible", "Within one to three months", "Within three to six months", "I am exploring"], location: "City / country (optional)", locationPlaceholder: "London, United Kingdom", privacyBefore: "I have read the", privacyLink: "privacy policy", privacyAfter: "and agree to my details being used to reply.", turnstile: "This enquiry is protected by Cloudflare Turnstile.", noJs: "JavaScript unavailable? Use the simple email contact route.", emailCta: "Email bonjour@thomas-nicoli.com", websiteError: "Enter a valid http or https URL.",
    },
    clarity: {
      eyebrow: "Project Clarity", title: "Clarify the project before building.", intro: "Six questions to organise the blockage, context and worthwhile outcome. This is not a chatbot or an instant answer.", asyncNote: "The request enters a secure queue even when my computer is off. A Gemma-assisted first read runs locally later; I review the report and every draft before replying.", signalStages: ["Context", "Secure queue", "Local Gemma", "Human review"], progress: "Question {current} of 6", stepAnnouncement: "Question {current} of 6: {title}",
      questions: [
        { title: "Are you an independent business, a digital team, or unsure?", hint: "Choose the option that best describes the current context." },
        { title: "What is currently getting stuck?", hint: "Describe the observable blockage, rather than a solution already chosen." },
        { title: "What systems or assets already exist?", hint: "Website, commerce, CRM, content, analytics, processes or documentation." },
        { title: "What observable outcome would make the project worthwhile?", hint: "A concrete signal that can be reviewed, without promising metrics." },
        { title: "What timing or constraint matters?", hint: "A date, dependency, budget, internal capacity or technical requirement." },
        { title: "Which language should the response use?", hint: "The reviewed reply will be in Spanish, English or French." },
      ],
      buyerOptions: ["Independent business", "Digital team", "Unsure"], fieldPlaceholders: ["For example: the site is not turning visits into enquiries…", "For example: Shopify, SFCC, HubSpot, content, spreadsheets…", "For example: the team can agree scope and the next step…", "For example: October launch, small team, CRM dependency…"], languageOptions: ["Español", "English", "Français"], next: "Next", back: "Back", detailsTitle: "Where to send the reviewed reply", detailsIntro: "These details are not part of the six diagnostic questions.", name: "Name", email: "Email", website: "Website or relevant URL (optional)", location: "City / country (optional)", consentPending: "I agree that Thomas Nicoli may process these details to analyse my request and reply. Planned retention: 30 days, unless I request earlier deletion.", turnstileError: "Complete the security check before submitting.", checkpointTitle: "Engineering preview — intake disabled", checkpointText: "You can review the journey, but no submission is stored while approved legal details and retention wording are missing.", submit: "Submit diagnostic", submitting: "Saving securely…", alternative: "Prefer a simple route? Use the standard contact form.", contactCta: "Go to contact", confirmationTitle: "Request received", confirmationText: "Your information is queued. The AI-assisted first read will be local and asynchronous; Thomas will review it before replying.", reference: "Reference", summaryTitle: "Submitted summary", duplicate: "This request was already queued; the same reference has been kept.", error: "The request could not be stored. Use normal contact or try later.", validation: "Review the marked field before continuing.", privacyLink: "Read the privacy policy",
    },
  },
  fr: {
    nav: "Project Clarity",
    buyerPaths: [
      { id: "independent", title: "Pour les activités indépendantes", text: "Sites ciblés, visibilité locale, bases éditoriales et automatisation d’un flux précis.", cta: "Clarifier mon projet" },
      { id: "digital-team", title: "Pour les équipes digitales", text: "Diagnostic e-commerce et CRM, alignement des équipes et responsables, appui à la livraison, opérations de plateforme, QA et passation.", cta: "Clarifier la prochaine étape" },
    ],
    contact: {
      website: "Site actuel ou URL utile (optionnel)", websitePlaceholder: "https://votre-site.fr", timing: "Échéance souhaitée (optionnel)", timingPlaceholder: "Choisir une option", timingOptions: ["Dès que possible", "Dans un à trois mois", "Dans trois à six mois", "Je suis en phase d’exploration"], location: "Ville / pays (optionnel)", locationPlaceholder: "Paris, France", privacyBefore: "J’ai lu la", privacyLink: "politique de confidentialité", privacyAfter: "et j’accepte l’utilisation de mes données pour recevoir une réponse.", turnstile: "Cette demande est protégée par Cloudflare Turnstile.", noJs: "JavaScript indisponible ? Utilisez le contact simple par email.", emailCta: "Écrire à bonjour@thomas-nicoli.com", websiteError: "Indiquez une URL http ou https valide.",
    },
    clarity: {
      eyebrow: "Project Clarity", title: "Clarifier le projet avant de construire.", intro: "Six questions pour ordonner le blocage, le contexte et le résultat qui mérite l’effort. Ce n’est ni un chatbot ni une réponse instantanée.", asyncNote: "La demande rejoint une file sécurisée même si mon ordinateur est éteint. Une première lecture assistée par Gemma est effectuée localement plus tard ; je relis le rapport et chaque brouillon avant de répondre.", signalStages: ["Contexte", "File sécurisée", "Gemma local", "Revue humaine"], progress: "Question {current} sur 6", stepAnnouncement: "Question {current} sur 6 : {title}",
      questions: [
        { title: "Êtes-vous une activité indépendante, une équipe digitale ou encore indécis ?", hint: "Choisissez l’option qui décrit le mieux le contexte actuel." },
        { title: "Qu’est-ce qui bloque actuellement ?", hint: "Décrivez le blocage observable, plutôt qu’une solution déjà décidée." },
        { title: "Quels systèmes ou actifs existent déjà ?", hint: "Site, e-commerce, CRM, contenu, analytics, processus ou documentation." },
        { title: "Quel résultat observable rendrait le projet utile ?", hint: "Un signal concret qui pourra être revu, sans promettre de métriques." },
        { title: "Quelle échéance ou contrainte compte ?", hint: "Date, dépendance, budget, capacité interne ou exigence technique." },
        { title: "Dans quelle langue la réponse doit-elle être rédigée ?", hint: "La réponse relue sera en espagnol, anglais ou français." },
      ],
      buyerOptions: ["Activité indépendante", "Équipe digitale", "Je ne sais pas encore"], fieldPlaceholders: ["Par exemple : le site ne transforme pas les visites en demandes…", "Par exemple : Shopify, SFCC, HubSpot, contenus, feuilles de calcul…", "Par exemple : l’équipe peut valider le périmètre et l’étape suivante…", "Par exemple : lancement en octobre, petite équipe, dépendance CRM…"], languageOptions: ["Español", "English", "Français"], next: "Suivant", back: "Retour", detailsTitle: "Où envoyer la réponse relue", detailsIntro: "Ces coordonnées ne font pas partie des six questions de diagnostic.", name: "Nom", email: "Email", website: "Site ou URL utile (optionnel)", location: "Ville / pays (optionnel)", consentPending: "J’accepte que Thomas Nicoli traite ces données pour analyser ma demande et me répondre. Conservation prévue : 30 jours, sauf demande de suppression anticipée.", turnstileError: "Effectuez la vérification de sécurité avant l’envoi.", checkpointTitle: "Preview technique — réception désactivée", checkpointText: "Le parcours peut être vérifié, mais aucune demande n’est stockée tant que les mentions légales et la durée de conservation ne sont pas approuvées.", submit: "Envoyer le diagnostic", submitting: "Enregistrement sécurisé…", alternative: "Vous préférez une voie simple ? Utilisez le formulaire de contact classique.", contactCta: "Aller au contact", confirmationTitle: "Demande reçue", confirmationText: "Vos informations sont en file d’attente. La première lecture assistée par IA sera locale et asynchrone ; Thomas la relira avant de répondre.", reference: "Référence", summaryTitle: "Résumé envoyé", duplicate: "Cette demande était déjà en file ; la même référence est conservée.", error: "La demande n’a pas pu être enregistrée. Utilisez le contact normal ou réessayez plus tard.", validation: "Vérifiez le champ indiqué avant de continuer.", privacyLink: "Lire la politique de confidentialité",
    },
  },
} as const;

export function getProjectClarityCopy(lang: Locale) {
  return copy[lang];
}

export type ProjectClarityCopy = ReturnType<typeof getProjectClarityCopy>;
