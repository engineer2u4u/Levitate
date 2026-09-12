/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * YouTube embed with captions switched off, and an optional poster facade.
 *
 * Captions: `cc_load_policy=0` only means "respect the viewer's preference",
 * so a viewer with captions on globally still gets them. `enablejsapi=1` lets
 * us postMessage the player and unload its caption modules once it reports
 * ready, which overrides that preference.
 *
 * `facade` shows a poster and play control in the house style — the same
 * treatment the PoSH section uses — and loads the player only when it is
 * clicked.
 *
 * YouTube's own branding on a playing embed, the title bar and the
 * "Watch on YouTube" button, cannot be removed: modestbranding was retired
 * in 2023 and covering the chrome would breach YouTube's terms. What the
 * facade can do is keep it off screen until somebody has asked to watch,
 * which is the state a visitor spends nearly all their time looking at. It
 * also keeps YouTube's scripts and cookies off the page until then.
 */
export default function YouTubeEmbed({
  id,
  title,
  autoplay = true,
  controls = false,
  facade = false,
  posterLabel,
  poster,
  onRequestPlay,
}: {
  id: string;
  title: string;
  autoplay?: boolean;
  controls?: boolean;
  /** Show a poster and load the player only on click. */
  facade?: boolean;
  /** Caption under the play control, as on the PoSH section. */
  posterLabel?: string;
  /** Override the still. Defaults to the video's own thumbnail. */
  poster?: string;
  /**
   * Handle the poster click yourself — to open the video in a modal, say —
   * instead of loading the player in place. Facade only.
   */
  onRequestPlay?: () => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  // A facade starts unplayed; every other use is already past the click.
  const [playing, setPlaying] = useState(!facade);

  useEffect(() => {
    const frame = ref.current;
    if (!frame || !playing) return;

    const send = (msg: Record<string, unknown>) => {
      frame.contentWindow?.postMessage(JSON.stringify(msg), "*");
    };

    /**
     * Wait for the player to say it is ready before commanding it.
     *
     * Firing `unloadModule` on a timer used to make the player throw
     * `isExternalMethodAvailable is not a function` into the console — it was
     * being asked to do something before it had finished wiring up its own
     * API. Harmless, but a real error on the page, and on a landing page that
     * loads a video immediately it happened on every visit.
     */
    const onMessage = (e: MessageEvent) => {
      if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname.replace(/^www\./, ""))) return;
      if (e.source !== frame.contentWindow) return;
      let data: { event?: string };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data?.event !== "onReady" && data?.event !== "initialDelivery") return;
      // "captions" is the legacy module name, "cc" the HTML5 one — send both.
      send({ event: "command", func: "unloadModule", args: ["captions"] });
      send({ event: "command", func: "unloadModule", args: ["cc"] });
    };

    window.addEventListener("message", onMessage);
    // Opens the handshake: the player only talks back once asked to.
    const hello = () => send({ event: "listening" });
    frame.addEventListener("load", hello);
    const timers = [300, 900, 2000].map((ms) => setTimeout(hello, ms));

    return () => {
      window.removeEventListener("message", onMessage);
      frame.removeEventListener("load", hello);
      timers.forEach(clearTimeout);
    };
  }, [playing]);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={onRequestPlay ?? (() => setPlaying(true))}
        aria-label={`Play: ${title}`}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
          cursor: "pointer",
          background: "#0a1b33",
          overflow: "hidden",
        }}
      >
        <img
          src={poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* scrim keeps the play control legible over the frame */}
        <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,27,51,.18),rgba(10,27,51,.52))" }} />
        <span
          style={{
            position: "relative",
            width: 78,
            height: 78,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 34px rgba(10,27,51,.45)",
          }}
        >
          <span style={{ width: 0, height: 0, borderLeft: "22px solid #fff", borderTop: "13px solid transparent", borderBottom: "13px solid transparent", marginLeft: 6 }} />
        </span>
        {posterLabel && (
          <span style={{ position: "relative", font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#fff", textShadow: "0 2px 12px rgba(10,27,51,.5)" }}>
            {posterLabel}
          </span>
        )}
      </button>
    );
  }

  const params = new URLSearchParams({
    // Arriving at the player through the poster is itself the request to play.
    autoplay: autoplay || facade ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    cc_load_policy: "0",
    controls: controls ? "1" : "0",
    enablejsapi: "1",
    playsinline: "1",
  });

  return (
    <iframe
      ref={ref}
      src={`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`}
      title={title}
      allow="accelerated-download; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
    />
  );
}
