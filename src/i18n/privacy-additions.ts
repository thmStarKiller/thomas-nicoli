import type { Locale } from "./config";

const additions = {
  es: [
    { heading: "Project Clarity: datos del diagnóstico", body: "Project Clarity recoge las respuestas a seis preguntas sobre el tipo de proyecto, el bloqueo, los sistemas existentes, el resultado observable, las restricciones y el idioma. Para poder responder también solicita nombre y email; web y ubicación son opcionales. Turnstile y una referencia de idempotencia ayudan a limitar abuso y duplicados." },
    { heading: "Tránsito y almacenamiento", body: "Cuando la recepción esté activada, Cloudflare validará y guardará temporalmente la solicitud en una cola acotada. Resend podrá transportar una notificación al propietario. Los campos saneados y el informe validado se almacenarán en un vault de leads separado, nunca en el vault personal del propietario." },
    { heading: "Inferencia local y revisión humana", body: "La primera lectura asistida por Gemma se ejecutará de forma asíncrona en el ordenador del propietario, no en el navegador del visitante. El modelo recibirá solo los campos saneados y conocimiento público aprobado. Ninguna decisión comercial ni email se envía de forma autónoma: Thomas revisa el informe y cualquier borrador antes de responder." },
    { heading: "Conservación y eliminación de Project Clarity", body: "La duración exacta y el texto de eliminación están pendientes de aprobación. Por ello la recepción pública de Project Clarity permanece desactivada. Antes de activarla, esta sección indicará el plazo aprobado, cómo solicitar la eliminación y cómo se vacía la papelera recuperable." },
  ],
  en: [
    { heading: "Project Clarity diagnostic data", body: "Project Clarity collects answers to six questions about project type, the blockage, existing systems, the observable outcome, constraints and response language. It also requests a name and email so a reply is possible; website and location are optional. Turnstile and an idempotency reference help limit abuse and duplicates." },
    { heading: "Transit and storage", body: "Once intake is enabled, Cloudflare will validate and temporarily store the request in a bounded queue. Resend may carry an owner notification. Sanitised fields and the validated report will be stored in a separate lead vault, never in the owner's personal vault." },
    { heading: "Local inference and human review", body: "The Gemma-assisted first read will run asynchronously on the owner's computer, not in the visitor's browser. The model receives only sanitised fields and approved public knowledge. No commercial decision or email is sent autonomously: Thomas reviews the report and every draft before replying." },
    { heading: "Project Clarity retention and deletion", body: "The exact retention period and deletion wording await approval. Project Clarity public intake therefore remains disabled. Before activation, this section will state the approved period, how deletion can be requested and how the recoverable trash is emptied." },
  ],
  fr: [
    { heading: "Données du diagnostic Project Clarity", body: "Project Clarity recueille les réponses à six questions sur le type de projet, le blocage, les systèmes existants, le résultat observable, les contraintes et la langue de réponse. Un nom et un email sont demandés pour pouvoir répondre ; le site et la localisation restent optionnels. Turnstile et une référence d'idempotence limitent les abus et doublons." },
    { heading: "Transit et stockage", body: "Une fois la réception activée, Cloudflare validera et stockera temporairement la demande dans une file bornée. Resend pourra acheminer une notification au propriétaire. Les champs assainis et le rapport validé seront conservés dans un vault de leads séparé, jamais dans le vault personnel du propriétaire." },
    { heading: "Inférence locale et revue humaine", body: "La première lecture assistée par Gemma sera effectuée de façon asynchrone sur l'ordinateur du propriétaire, pas dans le navigateur du visiteur. Le modèle ne reçoit que les champs assainis et des connaissances publiques approuvées. Aucune décision commerciale ni aucun email ne part de façon autonome : Thomas relit le rapport et chaque brouillon avant de répondre." },
    { heading: "Conservation et suppression Project Clarity", body: "La durée exacte et le texte de suppression attendent votre validation. La réception publique Project Clarity reste donc désactivée. Avant activation, cette section indiquera la durée approuvée, la procédure de suppression et la gestion de la corbeille récupérable." },
  ],
} as const;

export function getProjectClarityPrivacy(lang: Locale) {
  return additions[lang];
}
