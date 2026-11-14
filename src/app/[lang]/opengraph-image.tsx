import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site-config";
import { getSite } from "@/i18n/site";
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
  const { hero } = getSite(locale).home;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0a09",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#ece4d4", fontSize: 34 }}>{siteConfig.identity.ownerName}</span>
          <span style={{ color: "#e8642c", fontSize: 20, letterSpacing: 4, textTransform: "uppercase" }}>
            {hero.label}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 92, lineHeight: 1.02, letterSpacing: -2 }}>
          <span style={{ color: "#ece4d4" }}>{hero.title[0]}</span>
          <span style={{ color: "#e8642c", fontStyle: "italic" }}>{hero.title[1]}</span>
          <span style={{ color: "#ece4d4" }}>{hero.title[2]}</span>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid rgba(236,228,212,0.3)", paddingTop: 24 }}>
          <span style={{ color: "rgba(236,228,212,0.75)", fontSize: 26 }}>{hero.note}</span>
        </div>
      </div>
    ),
    size,
  );
}
