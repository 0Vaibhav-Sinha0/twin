"use client";

import { useRef, useCallback, useState } from "react";

export function usePianoMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [available, setAvailable] = useState(true);

  const play = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/birthday-piano.mp3");
      audio.volume = 0;
      audio.loop = true;
      audioRef.current = audio;

      audio.addEventListener("error", () => {
        setAvailable(false);
      });
    }

    const audio = audioRef.current;
    audio.play().then(() => {
      // Fade in gently over 2s
      let vol = 0;
      const fadeInterval = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.35) {
          vol = 0.35;
          clearInterval(fadeInterval);
        }
        audio.volume = vol;
      }, 100);
    }).catch(() => {
      setAvailable(false);
    });
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let vol = audio.volume;
    const fadeInterval = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        vol = 0;
        audio.pause();
        clearInterval(fadeInterval);
      }
      audio.volume = vol;
    }, 100);
  }, []);

  return { play, stop, available };
}
