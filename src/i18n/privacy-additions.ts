import type { Locale } from "./config";

const additions = {
  es: [
    { heading: "Project Clarity: datos del diagnóstico", body: "Project Clarity recoge las respuestas a seis preguntas sobre el tipo de proyecto, el bloqueo, los sistemas existentes, el resultado observable, las restricciones y el idioma. Para poder responder también solicita nombre y email; web y ubicación son opcionales. Turnstile y una referencia de idempotencia ayudan a limitar abuso y duplicados." },
    { heading: "Tránsito y almacenamiento", body: "Cloudflare valida y guarda temporalmente la solicitud en una cola acotada. Resend puede transportar una notificación al propietario. Los campos saneados y el informe validado se almacenan en un vault de leads separado, nunca en el vault personal del propietario." },
    { heading: "Inferencia local y revisión humana", body: "La primera lectura asistida por Gemma se ejecutará de forma asíncrona en el ordenador del propietario, no en el navegador del visitante. El modelo recibirá solo los campos saneados y conocimiento público aprobado. Ninguna decisión comercial ni email se envía de forma autónoma: Thomas revisa el informe y cualquier borrador antes de responder." },
    { heading: "Conservación y eliminación de Project Clarity", body: "La conservación operativa prevista es de 30 días desde la recepción. Los registros vencidos de la cola Cloudflare pueden purgarse mediante el worker privado; las notas locales vencidas pasan primero a una papelera recuperable y su eliminación definitiva requiere confirmación humana. Puedes solicitar una eliminación anticipada escribiendo a bonjour@thomas-nicoli.com." },
  ],
  en: [
    { heading: "Project Clarity diagnostic data", body: "Project Clarity collects answers to six questions about project type, the blockage, existing systems, the observable outcome, constraints and response language. It also requests a name and email so a reply is possible; website and location are optional. Turnstile and an idempotency reference help limit abuse and duplicates." },
    { heading: "Transit and storage", body: "Cloudflare validates and temporarily stores the request in a bounded queue. Resend may carry an owner notification. Sanitised fields and the validated report are stored in a separate lead vault, never in the owner's personal vault." },
    { heading: "Local inference and human review", body: "The Gemma-assisted first read will run asynchronously on the owner's computer, not in the visitor's browser. The model receives only sanitised fields and approved public knowledge. No commercial decision or email is sent autonomously: Thomas reviews the report and every draft before replying." },
    { heading: "Project Clarity retention and deletion", body: "The planned operational retention period is 30 days from receipt. Expired Cloudflare queue records can be purged through the private worker; expired local notes first move to recoverable trash and permanent deletion requires human confirmation. You can request earlier deletion at bonjour@thomas-nicoli.com." },
  ],
  fr: [
    { heading: "Données du diagnostic Project Clarity", body: "Project Clarity recueille les réponses à six questions sur le type de projet, le blocage, les systèmes existants, le résultat observable, les contraintes et la langue de réponse. Un nom et un email sont demandés pour pouvoir répondre ; le site et la localisation restent optionnels. Turnstile et une référence d'idempotence limitent les abus et doublons." },
    { heading: "Transit et stockage", body: "Cloudflare valide et stocke temporairement la demande dans une file bornée. Resend peut acheminer une notification au propriétaire. Les champs assainis et le rapport validé sont conservés dans un vault de leads séparé, jamais dans le vault personnel du propriétaire." },
    { heading: "Inférence locale et revue humaine", body: "La première lecture assistée par Gemma sera effectuée de façon asynchrone sur l'ordinateur du propriétaire, pas dans le navigateur du visiteur. Le modèle ne reçoit que les champs assainis et des connaissances publiques approuvées. Aucune décision commerciale ni aucun email ne part de façon autonome : Thomas relit le rapport et chaque brouillon avant de répondre." },
    { heading: "Conservation et suppression Project Clarity", body: "La durée de conservation opérationnelle prévue est de 30 jours à compter de la réception. Les enregistrements expirés de la file Cloudflare peuvent être purgés par le worker privé ; les notes locales expirées passent d’abord dans une corbeille récupérable et leur suppression définitive exige une confirmation humaine. Vous pouvez demander une suppression anticipée à bonjour@thomas-nicoli.com." },
  ],
} as const;

export function getProjectClarityPrivacy(lang: Locale) {
  return additions[lang];
}
