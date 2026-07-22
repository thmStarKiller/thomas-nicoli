"use client";

import { useEffect, useState } from "react";

/** Live Madrid clock for the footer. */
export function MadridClock({ label }: { label: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Madrid",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-porcelain/50 uppercase">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-cobalt-bright" />
      </span>
      {label} {time || "--:--:--"}
    </span>
  );
}
