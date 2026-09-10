"use client";

import { useEffect, useRef } from "react";

/**
 * YouTube embed with captions forcibly switched off.
 *
 * `cc_load_policy=0` alone only means "respect the viewer's preference", so a
 * viewer with captions enabled globally still gets them. Passing
 * `enablejsapi=1` lets us postMessage the player directly and unload its
 * caption modules, which overrides that preference. The player reports ready
 * asynchronously, so the command is repeated a few times after load.
 */
export default function YouTubeEmbed({
  id,
  title,
  autoplay = true,
  controls = false,
}: {
  id: string;
  title: string;
  autoplay?: boolean;
  controls?: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;

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
  }, []);

  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
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
