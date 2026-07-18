"use client";

import BottomDock from "./BottomDock";

interface PageShellProps {
  children: React.ReactNode;
  /** Pages that manage their own navigation lifecycle (e.g. finale) can hide the dock. */
  hideDock?: boolean;
}

// Every page that shows the bottom dock renders through this shell.
// The dock is a real flex item here — not a floating overlay — so the
// content region above it is automatically sized to the remaining
// space. No page can forget clearance; there's nothing to forget.
export default function PageShell({ children, hideDock }: PageShellProps) {
  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="relative flex-1 min-h-0 overflow-y-auto">
        {children}
      </div>
      {!hideDock && <BottomDock />}
    </div>
  );
}
