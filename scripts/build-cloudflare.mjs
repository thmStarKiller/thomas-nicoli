import { copyFileSync, cpSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const nextBinary = join(root, "node_modules", "next", "dist", "bin", "next");
const output = join(root, ".vercel", "output", "static");

rmSync(join(root, "out"), { recursive: true, force: true });
rmSync(join(root, ".vercel", "output"), { recursive: true, force: true });

const build = spawnSync(process.execPath, [nextBinary, "build"], {
  cwd: root,
  env: { ...process.env, CLOUDFLARE_PAGES: "1" },
  stdio: "inherit",
});

if (build.status !== 0) process.exit(build.status ?? 1);

mkdirSync(output, { recursive: true });
cpSync(join(root, "out"), output, { recursive: true });

// Next 16's static client router requests nested RSC payloads using flattened
// dot-separated filenames. Preserve the export tree and add exact aliases for
// hosts (including Cloudflare Pages) that do not rewrite those requests.
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(output);
let aliases = 0;
for (const source of files) {
  if (!source.endsWith(".txt")) continue;
  const parts = relative(output, source).split(sep);
  const marker = parts.findIndex((part) => part.startsWith("__next."));
  if (marker < 0 || marker === parts.length - 1) continue;
  const destination = join(output, ...parts.slice(0, marker), parts.slice(marker).join("."));
  copyFileSync(source, destination);
  aliases += 1;
}
console.log(`Created ${aliases} flattened Next.js RSC aliases`);
console.log(`Cloudflare Pages output prepared at ${output}`);
