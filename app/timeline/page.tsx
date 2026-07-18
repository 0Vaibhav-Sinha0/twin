import FriendshipTimeline from "@/components/timeline/FriendshipTimeline";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PageShell from "@/components/shared/PageShell";
export default function TimelinePage() {
  return <PageShell><FriendshipTimeline /><ThemeToggle /></PageShell>;
}
