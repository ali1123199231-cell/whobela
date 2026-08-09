"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Renders nothing — just records first-touch attribution on the initial load.
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
