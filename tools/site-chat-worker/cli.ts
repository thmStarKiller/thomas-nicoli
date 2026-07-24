#!/usr/bin/env node
import type { ChatAiOutput } from "../../src/lib/chat/contracts";
import { claimChatJob, completeChatJob } from "./queue-client";
import { LocalChatModelError, runLocalChatModel } from "./ollama";

function config() {
  const queueUrl = process.env.PROJECT_CLARITY_QUEUE_URL?.trim() ?? "";
  const workerToken = process.env.PROJECT_CLARITY_WORKER_TOKEN?.trim() ?? "";
  if (!queueUrl || !workerToken) throw new Error("queue_url_and_worker_token_required");
  return {
    queueUrl,
    workerToken,
    ollamaUrl: process.env.OLLAMA_URL?.trim() || "http://127.0.0.1:11434",
    model: process.env.OLLAMA_MODEL?.trim() || "gemma4-local",
  };
}

const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function runOnce(settings: ReturnType<typeof config>) {
  const job = await claimChatJob({ baseUrl: settings.queueUrl, workerToken: settings.workerToken });
  if (!job) return null;
  let output: ChatAiOutput;
  try {
    ({ output } = await runLocalChatModel(job.payload, { ollamaUrl: settings.ollamaUrl, model: settings.model }));
  } catch (error) {
    if (job.attempt_count >= 3) {
      const diagnostic = error instanceof LocalChatModelError
        ? error.diagnostic
        : String(error instanceof Error ? error.message : error).slice(0, 300);
      await completeChatJob({
        baseUrl: settings.queueUrl,
        workerToken: settings.workerToken,
        interactionId: job.interaction_id,
        status: "failed",
        diagnostic,
      }).catch(() => undefined);
    }
    throw error;
  }

  let completed = await completeChatJob({
    baseUrl: settings.queueUrl,
    workerToken: settings.workerToken,
    interactionId: job.interaction_id,
    status: "completed",
    output,
  });
  if (!completed.emailed) {
    await sleep(1_000);
    completed = await completeChatJob({
      baseUrl: settings.queueUrl,
      workerToken: settings.workerToken,
      interactionId: job.interaction_id,
      status: "completed",
      output,
    });
  }
  return { interactionId: job.interaction_id, status: "completed", emailed: Boolean(completed.emailed) };
}

async function main() {
  const [command = "once"] = process.argv.slice(2);
  const settings = config();
  if (command === "once") {
    const result = await runOnce(settings);
    if (result) console.log(JSON.stringify(result));
    return;
  }
  if (command !== "daemon") throw new Error("unknown_command");

  let stopped = false;
  process.on("SIGINT", () => { stopped = true; });
  process.on("SIGTERM", () => { stopped = true; });
  while (!stopped) {
    try {
      const result = await runOnce(settings);
      if (result) console.log(JSON.stringify(result));
      if (!result) await sleep(2_000);
    } catch (error) {
      console.error(JSON.stringify({ error: String(error instanceof Error ? error.message : error).slice(0, 300) }));
      await sleep(5_000);
    }
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ error: String(error instanceof Error ? error.message : error).slice(0, 300) }));
  process.exitCode = 1;
});
