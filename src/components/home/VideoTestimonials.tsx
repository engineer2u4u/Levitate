/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { videoTestimonials } from "@/lib/homeData";

export type PlayableClip = { id: string; title: string; portrait?: boolean };

/** Below 760px the row is a snap carousel (see .lp-vt-grid in globals.css). */
const CAROUSEL_QUERY = "(max-width: 760px)";
const ADVANCE_MS = 4500;
/** How long auto-advance stays paused after the visitor takes over. */
const RESUME_MS = 9000;

export default function VideoTestimonials({ onPlay }: { onPlay: (clip: PlayableClip) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Auto-advance only runs where the carousel exists, while it is on screen,
  // and while the visitor is not driving it themselves.
  const [isCarousel, setIsCarousel] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [held, setHeld] = useState(false);

  const scrollToCard = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(CAROUSEL_QUERY);
    const apply = () => setIsCarousel(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Track which card is centred, so the dots follow a manual swipe too.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const centre = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - centre);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setActive(nearest);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Don't animate a carousel nobody is looking at.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)), { threshold: 0.35 });
    io.observe(track);
    return () => io.disconnect();
  }, []);

  // A swipe, wheel or dot tap hands control to the visitor for a while.
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hold = useCallback(() => {
    setHeld(true);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setHeld(false), RESUME_MS);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("pointerdown", hold, { passive: true });
    track.addEventListener("wheel", hold, { passive: true });
    return () => {
      track.removeEventListener("pointerdown", hold);
      track.removeEventListener("wheel", hold);
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, [hold]);

  useEffect(() => {
    if (!isCarousel || !onScreen || held) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setActive((i) => {
        const next = (i + 1) % videoTestimonials.length;
        scrollToCard(next);
        return next;
      });
    }, ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isCarousel, onScreen, held, scrollToCard]);

  return (
    <div className="lp-sec" style={{ background: "#fff", padding: "72px 48px 80px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginBottom: 44 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>In Their Own Words</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 12px", letterSpacing: "-.02em" }}>Real Voices. Real Impact.</h2>
            <p style={{ font: "400 15.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0 }}>Hear it from professionals we&apos;ve trained</p>
          </div>
          <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{videoTestimonials.length} short clips · tap to play</div>
        </Reveal>

        {/* Grid on desktop; a swipeable snap carousel below 760px */}
        <div className="lp-vt-grid" ref={trackRef}>
          {videoTestimonials.map((v) => (
            <Reveal key={v.id} className="lp-vt-card" style={{ position: "relative", borderRadius: 18, overflow: "hidden", isolation: "isolate", border: "1px solid #e3eaf0", background: "#eef4f7", minHeight: 300, boxShadow: "0 2px 8px rgba(10,27,51,.06)" }}>
              <button
                type="button"
                onClick={() => onPlay({ id: v.id, title: v.title, portrait: v.portrait })}
                aria-label={`Play clip: ${v.title}`}
                style={{ display: "block", width: "100%", padding: 0, border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
              >
                {/* Full-resolution, unpadded sources: maxresdefault is 1280x720
                    edge to edge, and a Short's oardefault is its true 1080x1920
                    frame. hqdefault (480x360) would upscale into this crop, and
                    pads every clip to 4:3 — hence the zoom in the fallback. */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/${v.portrait ? "oardefault" : "maxresdefault"}.jpg`}
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.fallback) return;
                    el.dataset.fallback = "1";
                    el.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
                    el.style.transform = "scale(1.34)";
                  }}
                  alt=""
                  loading="lazy"
                  style={{ width: "100%", height: "100%", minHeight: 300, aspectRatio: "3/4", objectFit: "cover", objectPosition: "50% 50%", transform: "scale(1.02)", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,27,51,.05) 30%,rgba(10,27,51,.82))" }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(10,27,51,.35)" }}>
                  <div style={{ width: 0, height: 0, borderLeft: "17px solid #fff", borderTop: "10px solid transparent", borderBottom: "10px solid transparent", marginLeft: 5 }} />
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 18px 20px", font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc" }}>Watch clip →</div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Carousel position dots — hidden on desktop, where the row is a grid */}
        <div className="lp-vt-dots" role="tablist" aria-label="Video testimonials">
          {videoTestimonials.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show clip ${i + 1} of ${videoTestimonials.length}`}
              onClick={() => {
                hold();
                setActive(i);
                scrollToCard(i);
              }}
              className={`lp-vt-dot${i === active ? " is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
