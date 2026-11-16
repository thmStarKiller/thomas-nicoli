import { negotiateLocale } from "../src/i18n/config";

/**
 * The bare address has no page of its own. Send the visitor to the language
 * their browser asks for (Spanish, English or French), Spanish otherwise.
 * The static rule in public/_redirects stays as the fallback.
 */
export function onRequest({ request }: { request: Request }): Response {
  const url = new URL(request.url);
  url.pathname = `/${negotiateLocale(request.headers.get("accept-language"))}`;
  return new Response(null, {
    status: 302,
    headers: {
      location: url.toString(),
      vary: "Accept-Language",
      "cache-control": "private, no-store",
    },
  });
}
