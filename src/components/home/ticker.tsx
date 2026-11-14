/**
 * One slow line of what Thomas does, running under the hero. Decorative: the
 * same information is in the page as text, so it is hidden from assistive tech.
 */
export function Ticker({ items }: { items: readonly string[] }) {
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-7 font-display text-[clamp(1.6rem,3vw,2.7rem)] italic leading-none sm:px-10">
            {item}
          </span>
          <span className="size-2 bg-spice-bright" />
        </span>
      ))}
    </span>
  );
  return (
    <div aria-hidden className="ticker-wrap overflow-hidden border-y border-sand/15 bg-night py-6 text-sand sm:py-8">
      <div className="ticker" style={{ "--ticker-duration": "70s" } as React.CSSProperties}>
        {row}
        {row}
      </div>
    </div>
  );
}
