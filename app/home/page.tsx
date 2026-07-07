import AuroraCanvas from "@/components/home/AuroraCanvas";
import HeroContent from "@/components/home/HeroContent";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <AuroraCanvas />
      <HeroContent />
      <ThemeToggle />
      <BottomDock />
    </main>
  );
}
