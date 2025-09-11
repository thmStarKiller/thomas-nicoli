// Quoting model loader for Thomas's AI + Automation + Web services
// Loads JSON from public/quoting.json and caches it for reuse.

import fs from 'node:fs';
import path from 'node:path';

let cached: string | null = null;

export function getQuotingModel(): string {
  if (cached) return cached;
  try {
    const file = path.join(process.cwd(), 'public', 'quoting.json');
    cached = fs.readFileSync(file, 'utf8');
  } catch (e) {
    cached = JSON.stringify({ error: 'quoting.json not found' });
  }
  return cached!;
}
