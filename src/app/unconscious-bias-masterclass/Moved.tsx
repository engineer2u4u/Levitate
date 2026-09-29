"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Sends the visitor on, and gives them a link if the redirect cannot run. */
export default function Moved({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <div style={{ background: "#f7fafc", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ textAlign: "center", font: "500 14.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
        This masterclass has moved.{" "}
        <Link href={to} style={{ color: "#1b8f88", fontWeight: 700 }}>Unconscious Bias at Work →</Link>
      </div>
    </div>
  );
}
