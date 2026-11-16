import { describe, expect, it } from "vitest";
import { onRequest } from "../../functions/index";

const visit = (language?: string, url = "https://example.test/") =>
  onRequest({ request: new Request(url, { headers: language ? { "accept-language": language } : {} }) });

describe("root address language choice", () => {
  it("sends each supported language to its own home page", () => {
    expect(visit("en-GB,en;q=0.9").headers.get("location")).toBe("https://example.test/en");
    expect(visit("fr-FR,fr;q=0.9,en;q=0.8").headers.get("location")).toBe("https://example.test/fr");
    expect(visit("es-ES,es;q=0.9").headers.get("location")).toBe("https://example.test/es");
  });

  it("falls back to Spanish for other languages and for crawlers that send none", () => {
    expect(visit("de-DE,de;q=0.9").headers.get("location")).toBe("https://example.test/es");
    expect(visit().headers.get("location")).toBe("https://example.test/es");
  });

  it("uses the first supported language in the visitor's order of preference", () => {
    expect(visit("de;q=1.0,fr;q=0.8,en;q=0.5").headers.get("location")).toBe("https://example.test/fr");
  });

  it("is a temporary redirect that keeps the query string and varies by language", () => {
    const response = visit("en", "https://example.test/?utm_source=test");
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://example.test/en?utm_source=test");
    expect(response.headers.get("vary")).toBe("Accept-Language");
  });
});
