import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AnalysisReport } from "./analysis";

const labels = {
  es: { ack: "Gracias por compartir el contexto.", first: "Primera lectura asistida por IA (revisada por Thomas)", next: "Siguiente paso", notYet: "Qué no construir todavía", quick: "Tres mejoras rápidas", questions: "Preguntas útiles para una conversación", cta: "Si te encaja, podemos revisar estas preguntas en una conversación humana y decidir el alcance mínimo útil." },
  en: { ack: "Thank you for sharing the context.", first: "AI-assisted first read (reviewed by Thomas)", next: "Next step", notYet: "What not to build yet", quick: "Three quick wins", questions: "Useful discovery questions", cta: "If this feels useful, we can review these questions in a human conversation and agree the smallest useful scope." },
  fr: { ack: "Merci d’avoir partagé ce contexte.", first: "Première lecture assistée par IA (relue par Thomas)", next: "Étape suivante", notYet: "Ce qu’il ne faut pas encore construire", quick: "Trois améliorations rapides", questions: "Questions utiles pour un échange", cta: "Si cette lecture vous semble utile, nous pouvons reprendre ces questions lors d’un échange humain et définir le plus petit périmètre pertinent." },
} as const;

function safeHeader(value: string) {
  return value.replace(/[\r\n]/g, " ").trim();
}

export function draftBody(language: "es" | "en" | "fr", name: string, report: AnalysisReport) {
  const l = labels[language];
  return `${l.ack}${name ? ` ${name},` : ""}

${l.first}

${report.summary}

${l.next}
${report.nextStep}

${l.notYet}
${report.notYet.map((item) => `- ${item}`).join("\n")}

${l.quick}
${report.quickWins.map((item) => `- ${item}`).join("\n")}

${l.questions}
${report.discoveryQuestions.map((item) => `- ${item}`).join("\n")}

${l.cta}

— Thomas
`;
}

export async function createAndVerifyDraft(options: {
  leadVault: string;
  submissionId: string;
  recipient: string;
  language: "es" | "en" | "fr";
  name: string;
  report: AnalysisReport;
}) {
  const directory = join(options.leadVault, "Drafts");
  await mkdir(directory, { recursive: true });
  const path = join(directory, `${options.submissionId}.eml`);
  const subjectText = `Project Clarity — ${options.submissionId} — first read`;
  const subject = `=?UTF-8?B?${Buffer.from(subjectText).toString("base64")}?=`;
  const body = draftBody(options.language, options.name, options.report);
  const eml = [
    `To: ${safeHeader(options.recipient)}`,
    `Subject: ${subject}`,
    `X-Project-Clarity-ID: ${options.submissionId}`,
    `X-Project-Clarity-Language: ${options.language}`,
    "X-Unsent: 1",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");
  await writeFile(path, eml, "utf8");

  const reopened = await readFile(path, "utf8");
  const checks = {
    recipient: reopened.includes(`To: ${safeHeader(options.recipient)}`),
    subject: reopened.includes(options.submissionId),
    language: reopened.includes(`X-Project-Clarity-Language: ${options.language}`),
    submissionId: reopened.includes(`X-Project-Clarity-ID: ${options.submissionId}`),
    renderedBody: reopened.includes(options.report.summary) && reopened.includes(options.report.nextStep),
    unsent: reopened.includes("X-Unsent: 1"),
  };
  if (Object.values(checks).some((value) => !value)) throw new Error("draft_verification_failed");
  return { path, draftMessageId: `local-eml:${options.submissionId}`, checks };
}
