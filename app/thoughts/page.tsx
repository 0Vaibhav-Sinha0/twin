import ThoughtsBoard from "@/components/thoughts/ThoughtsBoard";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PageShell from "@/components/shared/PageShell";
export default function ThoughtsPage() {
  return <PageShell><ThoughtsBoard /><ThemeToggle /></PageShell>;
}
