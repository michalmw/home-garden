"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    // Use type assertion to tell TypeScript that workbox might exist on window
    if ("serviceWorker" in navigator && (window as any).workbox !== undefined) {
      // Skip service worker registration in development
      if (process.env.NODE_ENV === "development") return;

      // Register the service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
