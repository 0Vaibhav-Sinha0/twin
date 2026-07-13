"use client";

import { useState } from "react";
import FinaleSequence from "@/components/finale/FinaleSequence";
import BottomDock from "@/components/shared/BottomDock";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function FinalePage() {
  const [journeyComplete, setJourneyComplete] = useState(false);

  return (
    <main>
      <FinaleSequence onFutureRevealed={() => setJourneyComplete(true)} />
      {!journeyComplete && (
        <>
          <ThemeToggle />
          <BottomDock />
        </>
      )}
    </main>
  );
}
