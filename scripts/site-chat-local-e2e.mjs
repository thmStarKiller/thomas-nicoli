import { spawnSync } from "node:child_process";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:8799";
const origin = new URL(baseUrl).origin;
const sessionId = crypto.randomUUID();
const interactionId = crypto.randomUUID();

async function post(path, body) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(new URL(path, baseUrl), {
        method: "POST",
        headers: { "content-type": "application/json", origin, connection: "close" },
        body: JSON.stringify(body),
      });
      const payload = response.status === 204 ? null : await response.json();
      return { response, payload };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const opened = await post("/api/chat/session", {
  sessionId,
  locale: "es",
  turnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
  company: "",
});
if (opened.response.status !== 201 || !opened.payload?.sessionToken) {
  throw new Error(`session_failed_${opened.response.status}_${JSON.stringify(opened.payload)}`);
}

const queued = await post("/api/chat", {
  sessionId,
  sessionToken: opened.payload.sessionToken,
  interactionId,
  turnIndex: 1,
  locale: "es",
  pagePath: "/es",
  message: "Nuestra hoja de ruta de comercio digital tiene demasiados dueños y ninguna decisión clara.",
  history: [{ role: "assistant", content: "¿Qué intentas resolver?" }],
  company: "",
});
if (queued.response.status !== 202 || queued.payload?.status !== "queued") {
  throw new Error(`enqueue_failed_${queued.response.status}_${JSON.stringify(queued.payload)}`);
}

const worker = spawnSync(process.execPath, ["--import", "tsx", "tools/site-chat-worker/cli.ts", "once"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PROJECT_CLARITY_QUEUE_URL: baseUrl,
    PROJECT_CLARITY_WORKER_TOKEN: process.env.QA_WORKER_TOKEN || "local-chat-worker-token",
    OLLAMA_URL: "http://127.0.0.1:11434",
    OLLAMA_MODEL: "gemma4-local",
  },
  encoding: "utf8",
  timeout: 180_000,
});
if (worker.status !== 0) throw new Error(`worker_failed_${worker.stderr || worker.stdout}`);

const completed = await post("/api/chat/status", {
  sessionId,
  sessionToken: opened.payload.sessionToken,
  interactionId,
});
if (completed.response.status !== 200 || completed.payload?.status !== "completed" || !completed.payload?.reply) {
  throw new Error(`status_failed_${completed.response.status}_${JSON.stringify(completed.payload)}`);
}

console.log(JSON.stringify({
  ok: true,
  sessionId,
  interactionId,
  queuedStatus: queued.response.status,
  worker: JSON.parse(worker.stdout.trim()),
  replyLength: completed.payload.reply.length,
  questionCount: (completed.payload.reply.match(/\?/g) || []).length,
  suggestions: completed.payload.suggestions?.length ?? 0,
  emailed: completed.payload.emailed,
}));
