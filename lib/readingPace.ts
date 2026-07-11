import type { MessageLine } from "@/data/finale";

// Average adult silent reading speed is ~200-250 wpm, but for emotionally-paced
// on-screen text (short lines, meant to be *felt* not skimmed) we slow this down
// significantly — closer to spoken/narration pace so each line has room to land.
const WORDS_PER_MINUTE = 90;
const MIN_DISPLAY_MS = 2200;
const MAX_DISPLAY_MS = 7000;
const FADE_MS = 700;

export function getLineDisplayDuration(line: MessageLine): number {
  const wordCount = line.text.trim().split(/\s+/).length;
  const baseMs = (wordCount / WORDS_PER_MINUTE) * 60 * 1000;

  // Ellipses and short fragmentary lines ("But... but... but...") need extra
  // breathing room beyond raw word count — they're meant to trail off.
  const ellipsisBonus = (line.text.match(/\.\.\./g) || []).length * 400;

  const clamped = Math.min(MAX_DISPLAY_MS, Math.max(MIN_DISPLAY_MS, baseMs + ellipsisBonus));
  return clamped + (line.extraPause ?? 0);
}

export { FADE_MS };
