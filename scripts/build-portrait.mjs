// Writes the three portrait sizes used by src/components/ui/portrait.tsx.
// Run again after replacing public/images/profile.webp: node scripts/build-portrait.mjs
import sharp from "sharp";

const source = "public/images/profile.webp";
for (const width of [480, 768, 1024]) {
  const out = `public/images/profile-${width}.webp`;
  const info = await sharp(source).resize({ width }).webp({ quality: 72, effort: 6 }).toFile(out);
  console.log(out, Math.round(info.size / 1024) + " kB");
}
