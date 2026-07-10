"use client";

import { useRef, useCallback, useState } from "react";

interface UseBlowDetectorOptions {
  onBlow: () => void;
  threshold?: number; // volume threshold 0-255
  sustainedFrames?: number; // how many consecutive loud frames trigger blow
}

export function useBlowDetector({ onBlow, threshold = 45, sustainedFrames = 4 }: UseBlowDetectorOptions) {
  const [micStatus, setMicStatus] = useState<"idle" | "requesting" | "active" | "denied" | "unavailable">("idle");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const loudFrameCountRef = useRef(0);
  const triggeredRef = useRef(false);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    triggeredRef.current = false;
    loudFrameCountRef.current = 0;

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicStatus("unavailable");
      return;
    }

    setMicStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;

      setMicStatus("active");

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function checkVolume() {
        if (!analyserRef.current || triggeredRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;

        if (avg > threshold) {
          loudFrameCountRef.current += 1;
        } else {
          loudFrameCountRef.current = Math.max(0, loudFrameCountRef.current - 1);
        }

        if (loudFrameCountRef.current >= sustainedFrames) {
          triggeredRef.current = true;
          onBlow();
          stop();
          return;
        }

        rafRef.current = requestAnimationFrame(checkVolume);
      }

      checkVolume();
    } catch {
      setMicStatus("denied");
    }
  }, [onBlow, threshold, sustainedFrames, stop]);

  return { micStatus, start, stop };
}
