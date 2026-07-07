import MagicalGarden from "@/components/garden/MagicalGarden";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";
export default function GardenPage() {
  return <main className="relative"><MagicalGarden /><ThemeToggle /><BottomDock /></main>;
}
