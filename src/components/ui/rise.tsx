import { cn } from "@/lib/cn";

/**
 * Scroll-reveal wrapper. The inline script in the layout marks elements as
 * seen; without JavaScript or with reduced motion the content is simply shown.
 */
export function Rise({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "p";
}) {
  return (
    <Tag
      data-rise=""
      suppressHydrationWarning
      className={cn(className)}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
