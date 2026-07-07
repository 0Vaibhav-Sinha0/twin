import BirthdayCake from "@/components/cake/BirthdayCake";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";
export default function CakePage() {
  return <main className="relative"><BirthdayCake /><ThemeToggle /><BottomDock /></main>;
}
