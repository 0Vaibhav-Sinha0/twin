import ConstellationStory from "@/components/constellation/ConstellationStory";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";
export default function ConstellationPage() {
  return <main style={{ backgroundColor: "var(--bg-primary)" }}><ConstellationStory /><ThemeToggle /><BottomDock /></main>;
}
