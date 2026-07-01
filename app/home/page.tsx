export default function HomePage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      style={{ backgroundColor: "var(--day-parchment)" }}
    >
      <p className="font-hand text-3xl text-day-terracotta mb-4">
        ✦ you made it ✦
      </p>
      <h1 className="font-display text-6xl tracking-widest text-day-ink mb-6">
        Twin
      </h1>
      <p className="font-body text-xl italic text-day-ink/70 max-w-lg leading-relaxed">
        A world built for one person.
        <br />
        Cozy. Magical. Completely yours.
      </p>
      <div className="mt-12 w-px h-16 bg-day-terracotta/30 mx-auto" />
      <p className="font-hand text-day-sage text-lg mt-4 opacity-60">
        more coming soon…
      </p>
    </main>
  );
}
