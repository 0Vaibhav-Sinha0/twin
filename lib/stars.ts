const STARS_KEY = "twin_stars";

export function getStars(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(sessionStorage.getItem(STARS_KEY) ?? "0", 10);
}

export function addStars(count: number): number {
  const current = getStars();
  const next = current + count;
  sessionStorage.setItem(STARS_KEY, String(next));
  // Dispatch custom event so dock updates reactively
  window.dispatchEvent(new CustomEvent("stars-updated", { detail: next }));
  return next;
}

export function getStarRating(moves: number, pairs: number): number {
  // Perfect: pairs*2 moves (no mistakes) = 3 stars
  // Good: pairs*3 moves = 2 stars
  // Completed = 1 star minimum
  const ratio = moves / (pairs * 2);
  if (ratio <= 1.1) return 3;
  if (ratio <= 1.8) return 2;
  return 1;
}
