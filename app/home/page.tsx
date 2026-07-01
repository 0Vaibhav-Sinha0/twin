import AuroraCanvas from "@/components/home/AuroraCanvas";
import HeroContent from "@/components/home/HeroContent";
import BottomDock from "@/components/shared/BottomDock";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden mode-night">
      {/* Aurora background — fills full screen */}
      <AuroraCanvas />

      {/* Hero text content */}
      <HeroContent />

      {/* Bottom dock — floats above everything */}
      <BottomDock />
    </main>
  );
}
