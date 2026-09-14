"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Notes where this visitor came from, on the page they arrived on. Renders
 * nothing. Mounted once in the root layout, so every entry page is covered;
 * moving between pages afterwards is navigation, not a new source.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
