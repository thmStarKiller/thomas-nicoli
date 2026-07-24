import { mkdir, readFile, readdir, rename, rm } from "node:fs/promises";
import { basename, join } from "node:path";

export type RetentionCandidate = { path: string; submissionId: string; retentionUntil: string; status: string };

function property(source: string, name: string) {
  const match = source.match(new RegExp(`^${name}:\\s*[\"']?([^\"'\\n]+)`, "m"));
  return match?.[1]?.trim() ?? "";
}

export async function retentionPreview(leadVault: string, now = new Date()): Promise<RetentionCandidate[]> {
  const directory = join(leadVault, "Leads");
  let names: string[] = [];
  try { names = await readdir(directory); } catch { return []; }
  const candidates: RetentionCandidate[] = [];
  for (const name of names.filter((value) => value.endsWith(".md"))) {
    const path = join(directory, name);
    const content = await readFile(path, "utf8");
    const retentionUntil = property(content, "retention_until");
    const status = property(content, "status");
    if (["completed", "failed"].includes(status) && retentionUntil && new Date(retentionUntil) <= now) {
      candidates.push({ path, submissionId: property(content, "submission_id") || basename(name, ".md"), retentionUntil, status });
    }
  }
  return candidates.sort((a, b) => a.retentionUntil.localeCompare(b.retentionUntil));
}

export async function moveCandidatesToTrash(leadVault: string, candidates: RetentionCandidate[]) {
  const destination = join(leadVault, ".trash", new Date().toISOString().slice(0, 10));
  await mkdir(destination, { recursive: true });
  const moved: string[] = [];
  for (const candidate of candidates) {
    const target = join(destination, basename(candidate.path));
    await rename(candidate.path, target);
    moved.push(target);
  }
  return moved;
}

export async function permanentDeleteTrash(leadVault: string, confirmed: boolean) {
  if (!confirmed) throw new Error("explicit_confirmation_required");
  const trash = join(leadVault, ".trash");
  await rm(trash, { recursive: true, force: true });
  return trash;
}
