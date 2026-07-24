"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-to-top button — fades in after the user scrolls past ~400px and
 * smooth-scrolls back to the top. Sits bottom-left so it clears the
 * WhatsApp float on the bottom-right.
 */
export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: 26,
        left: 26,
        zIndex: 90,
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "1px solid rgba(27,143,136,.4)",
        background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 26px rgba(10,27,51,.22)",
        opacity: show ? 1 : 0,
        visibility: show ? "visible" : "hidden",
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .3s ease, transform .3s ease, visibility .3s ease",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
