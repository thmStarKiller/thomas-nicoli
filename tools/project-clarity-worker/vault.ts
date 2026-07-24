import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve, sep } from "node:path";
import type { AnalysisReport } from "./analysis";

export type QueueSubmission = {
  submission_id: string;
  created_at: string;
  updated_at?: string;
  language: "es" | "en" | "fr";
  buyer_type: "independent" | "digital-team" | "unsure";
  status: string;
  consent_version: string;
  retention_until: string;
  source: string;
  payload: Record<string, unknown>;
};

function comparable(path: string) {
  return resolve(path).replace(/[\\/]+$/, "").toLocaleLowerCase("en-US");
}

export function assertVaultIsolation(leadVault: string, personalVault: string) {
  const lead = comparable(leadVault);
  const personal = comparable(personalVault);
  if (!lead || lead === comparable(".")) throw new Error("lead_vault_required");
  if (lead === personal || lead.startsWith(`${personal}${sep.toLocaleLowerCase()}`)) {
    throw new Error("lead_vault_must_be_separate_from_personal_vault");
  }
}

export function redactSensitive(value: unknown): string {
  return String(value ?? "")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[REDACTED_PAYMENT_DATA]")
    .replace(/\b(?:re|sk|pk)_[A-Za-z0-9_-]{12,}\b/g, "[REDACTED_SECRET]")
    .replace(/\bBearer\s+[A-Za-z0-9._~-]{12,}\b/gi, "Bearer [REDACTED]")
    .replace(/\b(password|passwd|token|api[_ -]?key)\s*[:=]\s*\S+/gi, "$1=[REDACTED]");
}

function yaml(value: unknown) {
  return JSON.stringify(String(value ?? ""));
}

export async function writeLeadNote(options: {
  leadVault: string;
  submission: QueueSubmission;
  sanitized: Record<string, string>;
  report: AnalysisReport;
  draftMessageId: string;
}) {
  const id = options.submission.submission_id;
  if (!/^PC-\d{8}-[A-F0-9]{8}$/.test(id)) throw new Error("invalid_submission_id");
  const directory = join(options.leadVault, "Leads");
  await mkdir(directory, { recursive: true });
  const path = join(directory, `${id}.md`);
  const now = new Date().toISOString();
  const frontmatter = [
    "---",
    `submission_id: ${yaml(id)}`,
    `created_at: ${yaml(options.submission.created_at)}`,
    `updated_at: ${yaml(now)}`,
    `language: ${yaml(options.submission.language)}`,
    `buyer_type: ${yaml(options.submission.buyer_type)}`,
    `status: ${yaml("needs-review")}`,
    `consent_version: ${yaml(options.submission.consent_version)}`,
    `retention_until: ${yaml(options.submission.retention_until)}`,
    `source: ${yaml(options.submission.source)}`,
    `report_schema_version: ${yaml(options.report.schemaVersion)}`,
    `draft_message_id: ${yaml(options.draftMessageId)}`,
    "---",
  ].join("\n");
  const body = `# Project Clarity — ${id}

## Submitted details

- **Name:** ${redactSensitive(options.sanitized.name)}
- **Email:** ${redactSensitive(options.sanitized.email)}
- **Website:** ${redactSensitive(options.sanitized.website || "—")}
- **City / country:** ${redactSensitive(options.sanitized.location || "—")}
- **Buyer type:** ${redactSensitive(options.sanitized.buyerType)}

### What is stuck

${redactSensitive(options.sanitized.stuck)}

### Existing systems or assets

${redactSensitive(options.sanitized.assets)}

### Worthwhile observable outcome

${redactSensitive(options.sanitized.outcome)}

### Timing or constraint

${redactSensitive(options.sanitized.timingConstraints)}

## Validated AI-assisted first read

\`\`\`json
${JSON.stringify(options.report, null, 2)}
\`\`\`

## Human review

This note and its email draft require Thomas Nicoli's review. Nothing has been sent automatically.
`;
  await writeFile(path, `${frontmatter}\n\n${body}`, "utf8");
  await readFile(path, "utf8");
  const vault = encodeURIComponent(basename(resolve(options.leadVault)));
  const file = encodeURIComponent(`Leads/${id}`);
  return { path, obsidianUri: `obsidian://open?vault=${vault}&file=${file}` };
}
