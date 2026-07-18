import ChatTimeline from "@/components/chat/ChatTimeline";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PageShell from "@/components/shared/PageShell";
export default function ChatPage() {
  return <PageShell><ChatTimeline /><ThemeToggle /></PageShell>;
}
