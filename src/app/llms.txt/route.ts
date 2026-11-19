import { buildLlmsText } from "@/lib/llms";

export const dynamic = "force-static";

/** Plain-text summary of the site for AI assistants (https://llmstxt.org). */
export function GET() {
  return new Response(buildLlmsText(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
