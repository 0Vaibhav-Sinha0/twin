import MemoryGame from "@/components/games/MemoryGame";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PageShell from "@/components/shared/PageShell";
export default function GamesPage() {
  return <PageShell><MemoryGame /><ThemeToggle /></PageShell>;
}
