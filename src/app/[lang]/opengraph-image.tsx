import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site-config";
import { getDictionary } from "@/i18n";
import { hasLocale, locales } from "@/i18n/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "es";
  const dict = await getDictionary(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121215",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#3d5bff" }} />
          <span style={{ color: "#f4f1ea", fontSize: 30, letterSpacing: 1 }}>
            {siteConfig.identity.studioName}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ color: "#f4f1ea", fontSize: 84, fontWeight: 600, lineHeight: 1.04 }}>
            {dict.hero.line1}
          </span>
          <span style={{ color: "#3d5bff", fontSize: 84, fontWeight: 600, fontStyle: "italic", lineHeight: 1.04 }}>
            {dict.hero.line2} {dict.hero.line3}
          </span>
        </div>
        <span style={{ color: "rgba(244,241,234,0.55)", fontSize: 26 }}>
          {dict.hero.trustLine}
        </span>
      </div>
    ),
    size,
  );
}
