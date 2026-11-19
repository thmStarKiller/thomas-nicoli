import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("llms.txt", () => {
  it("summarises the offers with the prices shown on the site", async () => {
    const { buildLlmsText } = await import("@/lib/llms");
    const { getSite } = await import("@/i18n/site");
    const body = buildLlmsText();
    if (process.env.LLMS_PREVIEW) writeFileSync(process.env.LLMS_PREVIEW, body);

    expect(body.startsWith("# Thomas Nicoli Consulting\n\n> ")).toBe(true);
    const site = getSite("en");
    expect(body).toContain(site.home.audit.price);
    for (const offer of site.business.build.offers) {
      expect(body).toContain(offer.name);
      expect(body).toContain(offer.price);
    }
    for (const item of site.business.limits.items) expect(body).toContain(item.replace(/\s+/g, " ").trim());
    expect(body).toContain("https://metamorphoses-consulting.co.uk/fr/business");
    expect(body).not.toMatch(/undefined|\[object Object\]/);
  });
});
