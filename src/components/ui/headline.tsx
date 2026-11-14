import type { Accent } from "@/i18n/site";
import { cn } from "@/lib/cn";

type Tag = "h1" | "h2" | "h3" | "p";

const isWord = (token: string) => token.trim() !== "";
const tokens = (text: string) => text.split(/(\s+)/).filter((token) => token !== "");
const countWords = (text: string) => tokens(text).filter(isWord).length;

/** One part of a headline: each word in its own mask, with a staggered delay. */
function Words({ text, offset, start, step }: { text: string; offset: number; start: number; step: number }) {
  const list = tokens(text);
  return (
    <>
      {list.map((token, i) => {
        if (!isWord(token)) return " ";
        const position = offset + list.slice(0, i).filter(isWord).length;
        return (
          <span className="w" key={i}>
            <span style={{ "--d": `${start + position * step}ms` } as React.CSSProperties}>{token}</span>
          </span>
        );
      })}
    </>
  );
}

/**
 * Display headline whose words rise from behind a mask when it enters the
 * viewport. The middle part of the tuple is set in italic and accent colour.
 * Words stay real text, so the heading reads normally to assistive tech and
 * without JavaScript.
 */
export function Headline({
  parts,
  as: Component = "h2",
  className,
  accentClassName = "text-spice",
  start = 0,
  step = 55,
}: {
  parts: Accent | string;
  as?: Tag;
  className?: string;
  accentClassName?: string;
  /** Delay before the first word, in milliseconds. */
  start?: number;
  step?: number;
}) {
  const [before, accent, after]: Accent = typeof parts === "string" ? [parts, "", ""] : parts;
  const accentOffset = countWords(before);
  const afterOffset = accentOffset + countWords(accent);

  return (
    <Component data-words="" suppressHydrationWarning className={cn("font-display", className)}>
      <Words text={before} offset={0} start={start} step={step} />
      {accent && (
        <em className={accentClassName}>
          <Words text={accent} offset={accentOffset} start={start} step={step} />
        </em>
      )}
      <Words text={after} offset={afterOffset} start={start} step={step} />
    </Component>
  );
}

/** Hairline that draws itself from left to right when it scrolls into view. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span
      aria-hidden
      data-draw=""
      suppressHydrationWarning
      className={cn("rule", className)}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    />
  );
}
