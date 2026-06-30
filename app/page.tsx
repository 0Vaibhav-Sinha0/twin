export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-8 min-h-screen px-6 text-center">
      <p className="font-hand text-2xl text-day-terracotta">
        foundation check
      </p>
      <h1 className="font-display text-5xl tracking-wide text-day-ink">
        Twin
      </h1>
      <p className="font-body text-lg italic text-day-ink/70 max-w-md">
        Day mode — parchment, ink, terracotta. The cozy register for journal,
        letters, and gallery pages.
      </p>

      <div className="mode-night w-full max-w-2xl rounded-2xl p-12 mt-8 border border-night-electric/20">
        <p className="font-hand text-xl text-night-electric mb-2">
          foundation check — night mode
        </p>
        <h2 className="font-display text-4xl text-night-glow tracking-widest">
          Welcome, Twin
        </h2>
        <p className="font-body text-night-glow/60 mt-4 italic">
          Night mode — void, electric blue, violet. The cinematic register
          for the intro, the cake, the garden.
        </p>
      </div>
    </main>
  );
}
