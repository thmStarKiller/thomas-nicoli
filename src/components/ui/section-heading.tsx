import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="font-display text-[length:var(--text-h2)] leading-[1.08] text-balance">
        {title}
      </h2>
      {lead && (
        <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-graphite-soft">
          {lead}
        </p>
      )}
    </div>
  );
}
