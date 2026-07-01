"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INTRO_CONFIG } from "@/lib/introConfig";

export type IntroPhase =
  | "void"
  | "particles-gather"
  | "tracing"
  | "stroke-resolve"
  | "hold"
  | "pulse"
  | "drift"
  | "zoom"
  | "done";

export function useIntroSequence(onComplete: () => void) {
  const [phase, setPhase] = useState<IntroPhase>("void");
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { timing } = INTRO_CONFIG;

  useEffect(() => {
    const tl = gsap.timeline();
    timelineRef.current = tl;

    const t = timing;
    let elapsed = 0;

    // Phase: particles appear from void
    tl.call(() => setPhase("particles-gather"), [], elapsed);
    elapsed += t.particleGather;

    // Phase: particles begin tracing letters
    tl.call(() => setPhase("tracing"), [], elapsed);
    elapsed += t.traceStart + t.traceDuration;

    // Phase: SVG stroke resolves
    tl.call(() => setPhase("stroke-resolve"), [], elapsed);
    elapsed += t.strokeResolve;

    // Phase: hold
    tl.call(() => setPhase("hold"), [], elapsed);
    elapsed += t.holdComplete;

    // Phase: pulse
    tl.call(() => setPhase("pulse"), [], elapsed);
    elapsed += t.pulse;

    // Phase: particles drift away
    tl.call(() => setPhase("drift"), [], elapsed);
    elapsed += t.particleDrift;

    // Phase: zoom through
    tl.call(() => setPhase("zoom"), [], elapsed);
    elapsed += t.zoomThrough;

    // Done — trigger route transition
    tl.call(() => {
      setPhase("done");
      onComplete();
    }, [], elapsed);

    return () => {
      tl.kill();
    };
  }, [onComplete, timing]);

  return { phase };
}
