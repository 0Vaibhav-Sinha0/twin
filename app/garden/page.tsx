import MagicalGarden from "@/components/garden/MagicalGarden";
import BottomDock from "@/components/shared/BottomDock";

export default function GardenPage() {
  return (
    <main className="relative">
      <MagicalGarden />
      <BottomDock />
    </main>
  );
}
