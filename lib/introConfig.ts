export const INTRO_CONFIG = {
  // Phase durations in seconds
  timing: {
    particleGather: 1.2,   // ambient particles appear from void
    traceStart: 1.5,       // particles begin tracing letterforms
    traceDuration: 2.8,    // how long the tracing takes
    strokeResolve: 0.6,    // SVG stroke snaps in underneath
    holdComplete: 1.0,     // text holds fully formed
    pulse: 0.4,            // single pulse beat
    particleDrift: 0.8,    // particles drift away
    zoomThrough: 1.2,      // camera zooms through text into homepage
    totalBeforeZoom: 7.5,  // total before transition starts
  },

  // Night / Magic palette (matches globals.css tokens)
  colors: {
    void: "#05070f",
    indigoDeep: "#0b1230",
    electric: "#3aa9ff",
    electricDim: "#1a6bb5",
    violet: "#9f7aea",
    glow: "#e8f4ff",
    particleCore: "#ffffff",
    particleTrail: "#3aa9ff",
  },

  // Ambient floating particles
  ambient: {
    count: 120,
    minSize: 0.5,
    maxSize: 2.5,
    speed: 0.15,
    glowStrength: 8,
  },

  // Tracing particles that draw the letters
  trace: {
    count: 280,
    size: 1.8,
    speed: 0.6,
    trailLength: 6,
    glowStrength: 12,
  },

  // SVG stroke animation
  stroke: {
    width: 2,
    color: "#3aa9ff",
    glowColor: "#9f7aea",
    duration: 0.6,
  },

  // Whether intro has played this session
  storageKey: "twin_intro_played",
} as const;
