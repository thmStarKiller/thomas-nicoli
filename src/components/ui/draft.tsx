import { siteConfig } from "@/content/site-config";
import { cn } from "@/lib/cn";

/**
 * Marks content that still needs Thomas's input. Rendered only while
 * `features.showDraftPlaceholders` is on; switch it off before going live.
 */
export function Draft({
  children,
  className,
  label = "Draft",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  if (!siteConfig.features.showDraftPlaceholders) return null;
  return (
    <div className={cn("draft px-4 py-3 text-[15px] leading-snug", className)} data-draft="">
      <span className="draft-tag mr-2 align-middle">{label}</span>
      <span className="align-middle">{children}</span>
    </div>
  );
}
