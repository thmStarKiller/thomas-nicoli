import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
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
console.log(`Cloudflare Pages output prepared at ${output}`);
