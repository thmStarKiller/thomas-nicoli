"use client";

import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { HeroFallback } from "./hero-fallback";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

/** If WebGL/the scene throws for any reason, the fallback visual takes over. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[hero-3d] scene failed, using static fallback.", error);
  }
  render() {
    return this.state.failed ? <HeroFallback /> : this.props.children;
  }
}

function webGLAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(reduceMotionQuery);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reduceMotionQuery).matches;
}

// Server snapshot: assume reduced motion → static fallback during SSR.
// (Client DOM matches because the dynamically imported scene also renders
// the fallback while its chunk loads.)
function getReducedMotionServerSnapshot() {
  return true;
}

export function Hero3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Lazy one-shot capability checks — safe because the rendered output stays
  // identical to the server output until the scene chunk is ready.
  const [webgl] = useState(webGLAvailable);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const enabled = webgl && !reduceMotion;
  const [active, setActive] = useState(true);

  // Pause (unmount) the render loop when the canvas is offscreen or the tab is hidden.
  useEffect(() => {
    if (!enabled || !wrapRef.current) return;
    const el = wrapRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && !document.hidden),
      { rootMargin: "80px" },
    );
    observer.observe(el);

    const onVisibility = () => {
      setActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full"
      aria-hidden="true"
      role="presentation"
    >
      {enabled && active ? (
        <SceneBoundary>
          <HeroScene />
        </SceneBoundary>
      ) : (
        <HeroFallback />
      )}
    </div>
  );
}
