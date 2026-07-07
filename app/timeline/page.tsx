import FriendshipTimeline from "@/components/timeline/FriendshipTimeline";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";
export default function TimelinePage() {
  return <main><FriendshipTimeline /><ThemeToggle /><BottomDock /></main>;
}
