import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "concept" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
        tone === "neutral" && "border-line text-graphite-soft",
        tone === "concept" && "border-cobalt/40 bg-cobalt/5 text-cobalt",
        tone === "accent" && "border-transparent bg-cobalt text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
