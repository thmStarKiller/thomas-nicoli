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
  fade = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "p";
  /**
   * Set to false for content on the first screen: it then only slides into
   * place and is never invisible, so it counts as painted straight away.
   */
  fade?: boolean;
}) {
  return (
    <Tag
      {...(fade ? { "data-rise": "" } : { "data-lift": "" })}
      suppressHydrationWarning
      className={cn(className)}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
