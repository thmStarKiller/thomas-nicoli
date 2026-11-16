import { siteConfig } from "@/content/site-config";

/**
 * The portrait in three widths, so a phone does not download the desktop
 * file. The smaller files sit next to the original in public/images and are
 * produced by scripts/build-portrait.mjs.
 */
export function Portrait({
  alt,
  sizes,
  priority = false,
  focus = "50% 24%",
}: {
  alt: string;
  sizes: string;
  priority?: boolean;
  focus?: string;
}) {
  const src = siteConfig.media.profileImage;
  const base = src.replace(/\.webp$/, "");
  return (
    // eslint-disable-next-line @next/next/no-img-element -- the site is exported statically, so next/image cannot resize
    <img
      src={`${base}-1024.webp`}
      srcSet={`${base}-480.webp 480w, ${base}-768.webp 768w, ${base}-1024.webp 1024w`}
      sizes={sizes}
      alt={alt}
      width={1024}
      height={1536}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className="absolute inset-0 size-full object-cover"
      style={{ objectPosition: focus }}
    />
  );
}
