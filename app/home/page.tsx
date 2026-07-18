import AuroraCanvas from "@/components/home/AuroraCanvas";
import HeroContent from "@/components/home/HeroContent";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PageShell from "@/components/shared/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <div className="relative min-h-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
        <AuroraCanvas />
        <HeroContent />
        <ThemeToggle />
      </div>
    </PageShell>
  );
}
