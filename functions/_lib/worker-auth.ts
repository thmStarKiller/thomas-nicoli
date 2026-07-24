import { HttpError, sha256 } from "./http";

export async function requireWorkerBearer(request: Request, expected?: string): Promise<void> {
  if (!expected) throw new HttpError(503, "worker_not_configured");
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const [actualHash, expectedHash] = await Promise.all([sha256(supplied), sha256(expected)]);
  if (!supplied || actualHash !== expectedHash) throw new HttpError(401, "worker_unauthorized");
}
