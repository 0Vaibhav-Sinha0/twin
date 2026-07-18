import ConstellationStory from "@/components/constellation/ConstellationStory";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function ConstellationPage() {
  return (
    <main style={{ backgroundColor: "var(--bg-primary)" }}>
      <ConstellationStory />
      <ThemeToggle />
      {/*
        This page keeps real document-level (window) scroll, because
        the sticky star map inside ConstellationStory tracks window
        scroll position directly to drive its scroll-jacked animation.
        Nesting it in PageShell's own scroll container would break that
        mechanic, so the dock stays a floating overlay here via the
        `floating` prop — its content already keeps clearance from it.
      */}
      <BottomDock floating />
    </main>
  );
}
