"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

/**
 * Reveal-on-scroll wrapper — mirrors the design's [data-reveal] behaviour:
 * elements start hidden (opacity 0, translateY 28px) and animate in when
 * they enter the viewport.
 */
export default function Reveal({
  children,
  style,
  className,
  onMouseMove,
  onMouseLeave,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("lp-revealed");

    // Already in view on mount (e.g. above the fold)?
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lp-reveal${className ? ` ${className}` : ""}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
