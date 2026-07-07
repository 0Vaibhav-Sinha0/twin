import MemoryGame from "@/components/games/MemoryGame";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";
export default function GamesPage() {
  return <main><MemoryGame /><ThemeToggle /><BottomDock /></main>;
}
