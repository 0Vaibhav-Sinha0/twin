"use client";

import { useState } from "react";
import FinaleSequence from "@/components/finale/FinaleSequence";
import ThemeToggle from "@/components/shared/ThemeToggle";
import PageShell from "@/components/shared/PageShell";

export default function FinalePage() {
  const [journeyComplete, setJourneyComplete] = useState(false);

  return (
    <PageShell hideDock={journeyComplete}>
      <FinaleSequence onFutureRevealed={() => setJourneyComplete(true)} />
      {!journeyComplete && <ThemeToggle />}
    </PageShell>
  );
}
