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

    const send = (func: string, args: unknown[] = []) => {
      frame.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
    };

    const killCaptions = () => {
      // "captions" is the legacy module name, "cc" the HTML5 one — send both.
      send("unloadModule", ["captions"]);
      send("unloadModule", ["cc"]);
    };

    // The player becomes responsive shortly after the iframe loads; retry
    // briefly so the command lands whenever that happens.
    const timers = [300, 800, 1500, 2500, 4000].map((ms) => setTimeout(killCaptions, ms));
    frame.addEventListener("load", killCaptions);

    return () => {
      timers.forEach(clearTimeout);
      frame.removeEventListener("load", killCaptions);
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
