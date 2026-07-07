import ChatTimeline from "@/components/chat/ChatTimeline";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";
export default function ChatPage() {
  return <main><ChatTimeline /><ThemeToggle /><BottomDock /></main>;
}
