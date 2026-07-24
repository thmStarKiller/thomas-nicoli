#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { analyzeLead, InvalidModelOutputError } from "./analysis";
import { claimSubmission, purgeExpiredQueue, updateState } from "./queue-client";
import { createAndVerifyDraft } from "./draft";
import { assertVaultIsolation, type QueueSubmission, writeLeadNote } from "./vault";
import { moveCandidatesToTrash, permanentDeleteTrash, retentionPreview } from "./retention";

function config() {
  const leadVault = process.env.PROJECT_CLARITY_LEAD_VAULT?.trim();
  const personalVault = process.env.PROJECT_CLARITY_PERSONAL_VAULT?.trim();
  if (!leadVault || !personalVault) throw new Error("lead_and_personal_vault_paths_required");
  assertVaultIsolation(leadVault, personalVault);
  return {
    leadVault,
    personalVault,
    queueUrl: process.env.PROJECT_CLARITY_QUEUE_URL || "",
    workerToken: process.env.PROJECT_CLARITY_WORKER_TOKEN || "",
    ollamaUrl: process.env.OLLAMA_URL || "http://127.0.0.1:11434",
    model: process.env.OLLAMA_MODEL || "gemma4-local",
  };
}

async function processSubmission(submission: QueueSubmission, settings: ReturnType<typeof config>) {
  const { report, sanitized } = await analyzeLead(submission.payload, {
    ollamaUrl: settings.ollamaUrl,
    model: settings.model,
  });
  const draft = await createAndVerifyDraft({
    leadVault: settings.leadVault,
    submissionId: submission.submission_id,
    recipient: sanitized.email,
    language: submission.language,
    name: sanitized.name,
    report,
  });
  const note = await writeLeadNote({
    leadVault: settings.leadVault,
    submission,
    sanitized,
    report,
    draftMessageId: draft.draftMessageId,
  });
  return { submissionId: submission.submission_id, note, draft, status: "needs-review" as const };
}

async function run() {
  const [command = "once", argument, confirmation] = process.argv.slice(2);
  const settings = config();

  if (command === "fixture") {
    if (!argument) throw new Error("fixture_path_required");
    const submission = JSON.parse(await readFile(resolve(argument), "utf8")) as QueueSubmission;
    const result = await processSubmission(submission, settings);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "retention-preview") {
    console.log(JSON.stringify({ mode: "preview", destructive: false, candidates: await retentionPreview(settings.leadVault) }, null, 2));
    return;
  }

  if (command === "retention-trash") {
    const candidates = await retentionPreview(settings.leadVault);
    console.log(JSON.stringify({ mode: "recoverable-trash", moved: await moveCandidatesToTrash(settings.leadVault, candidates) }, null, 2));
    return;
  }

  if (command === "retention-delete") {
    const confirmed = argument === "--confirm-permanent-delete" || confirmation === "--confirm-permanent-delete";
    console.log(JSON.stringify({ mode: "permanent", deleted: await permanentDeleteTrash(settings.leadVault, confirmed) }, null, 2));
    return;
  }

  if (command === "queue-purge") {
    if (!settings.queueUrl || !settings.workerToken) throw new Error("queue_url_and_worker_token_required");
    const confirmed = argument === "--confirm-expired" || confirmation === "--confirm-expired";
    console.log(JSON.stringify({
      mode: "queue-purge",
      ...(await purgeExpiredQueue({
        baseUrl: settings.queueUrl,
        workerToken: settings.workerToken,
        confirmed,
      })),
    }, null, 2));
    return;
  }

  if (command !== "once") throw new Error("unknown_command");
  if (!settings.queueUrl || !settings.workerToken) throw new Error("queue_url_and_worker_token_required");
  const submission = await claimSubmission({ baseUrl: settings.queueUrl, workerToken: settings.workerToken });
  if (!submission) return;
  try {
    const result = await processSubmission(submission, settings);
    await updateState({
      baseUrl: settings.queueUrl,
      workerToken: settings.workerToken,
      submissionId: submission.submission_id,
      status: "needs-review",
      draftMessageId: result.draft.draftMessageId,
    });
    console.log(JSON.stringify({ submissionId: result.submissionId, status: result.status, note: result.note.path, draft: result.draft.path }));
  } catch (error) {
    const diagnostic = error instanceof InvalidModelOutputError ? error.diagnostic : String(error instanceof Error ? error.message : error).slice(0, 240);
    await updateState({ baseUrl: settings.queueUrl, workerToken: settings.workerToken, submissionId: submission.submission_id, status: "failed", diagnostic });
    throw error;
  }
}

run().catch((error) => {
  console.error(JSON.stringify({ error: String(error instanceof Error ? error.message : error).slice(0, 240) }));
  process.exitCode = 1;
});
