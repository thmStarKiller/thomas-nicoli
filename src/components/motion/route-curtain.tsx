"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A block of spice that crosses the screen after each navigation. The new
 * page is already in place underneath, so the wipe only reveals it and never
 * delays it. Styled inside a reduced-motion query, so it is inert otherwise.
 */
export function RouteCurtain() {
  const pathname = usePathname();
  const [previous, setPrevious] = useState(pathname);
  const [run, setRun] = useState(0);

  // Adjust state during render when the route changes.
  if (previous !== pathname) {
    setPrevious(pathname);
    setRun((value) => value + 1);
  }

  if (run === 0) return null;
  return <div key={run} aria-hidden className="route-curtain" />;
}
