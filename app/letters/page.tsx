import LettersGrid from "@/components/letters/LettersGrid";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PageShell from "@/components/shared/PageShell";
export default function LettersPage() {
  return <PageShell><LettersGrid /><ThemeToggle /></PageShell>;
}
