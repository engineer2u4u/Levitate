"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
  to: number;
  dec?: number;
  /** "mount" animates shortly after mount, "view" animates when scrolled into view */
  trigger?: "mount" | "view";
  /** external signal to start the animation (used by grouped sections like Impact) */
  start?: boolean;
};

const format = (v: number, dec: number) =>
  dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN");

/**
 * Animated number counter — mirrors the design's animateCounts() easing
 * (cubic ease-out over 1700ms).
 */
export default function Counter({
  to,
  dec = 0,
  trigger = "mount",
  start,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => format(to, dec));
  const ran = useRef(false);

  const run = () => {
    if (ran.current) return;
    ran.current = true;
    const t0 = performance.now();
    const dur = 1700;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(format(to * e, dec));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Start hidden-ish at 0 before animating.
  useEffect(() => {
    setDisplay(format(0, dec));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Explicit external start (grouped sections).
  useEffect(() => {
    if (start) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  useEffect(() => {
    if (start !== undefined) return; // controlled externally
    if (trigger === "mount") {
      const id = setTimeout(run, 300);
      return () => clearTimeout(id);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, start]);

  return <span ref={ref}>{display}</span>;
}
