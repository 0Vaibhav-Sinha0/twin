import ConstellationStory from "@/components/constellation/ConstellationStory";
import BottomDock from "@/components/shared/BottomDock";

export default function ConstellationPage() {
  return (
    <main style={{ backgroundColor: "#02040c" }}>
      <ConstellationStory />
      <BottomDock />
    </main>
  );
}
