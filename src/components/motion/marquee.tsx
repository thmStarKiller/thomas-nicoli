import { cn } from "@/lib/cn";

/**
 * Infinite marquee strip (CSS animation, duplicated content).
 * Reduced-motion: animation disabled globally, content sits statically.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  separator = "✦",
  duration = 28,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  separator?: string;
  duration?: number;
}) {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex w-max shrink-0 items-center"
    >
      {items.map((item, i) => (
        <span key={i} className={cn("flex items-center whitespace-nowrap", itemClassName)}>
          <span>{item}</span>
          <span className="mx-6 opacity-60" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee"
        style={{ animationDuration: `${duration}s` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
