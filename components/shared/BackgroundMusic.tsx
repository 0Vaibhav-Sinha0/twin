"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Song 1 plays on loop across the whole journey — entry through the
// constellation page. It stops on /finale, where song 2 takes over
// (handled separately inside FinaleSequence).
const EXCLUDED_ROUTES = ["/finale"];

export default function BackgroundMusic() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  // Create the audio element once, on first mount
  useEffect(() => {
    const audio = new Audio("/audio/song-1.mp4");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    // Browsers block audio-with-sound autoplay before a user gesture.
    // Try immediately, and also retry on the first tap/click anywhere
    // so it reliably starts as soon as she interacts with the page.
    function tryPlay() {
      const el = audioRef.current;
      if (!el) return;
      const shouldPlay = !EXCLUDED_ROUTES.includes(window.location.pathname);
      if (!shouldPlay) return;
      el.play().then(() => {
        unlockedRef.current = true;
      }).catch(() => {
        // Still blocked — the interaction listener below will retry
      });
    }

    tryPlay();

    function onFirstInteraction() {
      tryPlay();
      if (unlockedRef.current) {
        window.removeEventListener("click", onFirstInteraction);
        window.removeEventListener("touchstart", onFirstInteraction);
      }
    }
    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);

    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      audio.pause();
    };
  }, []);

  // Play/pause based on the current route
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldPlay = !EXCLUDED_ROUTES.includes(pathname ?? "");
    if (shouldPlay) {
      audio.play().catch(() => {
        // Will retry on next interaction via the listener set up on mount
      });
    } else {
      audio.pause();
    }
  }, [pathname]);

  return null;
}
