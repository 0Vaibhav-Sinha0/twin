"use client";

import BirthdayCake from "@/components/cake/BirthdayCake";
import PageShell from "@/components/shared/PageShell";
import { useForceDarkMode } from "@/lib/theme";

export default function CakePage() {
  // The cake is a fixed nighttime magic scene — always dark,
  // regardless of the site-wide light/dark toggle.
  useForceDarkMode();

  return (
    <PageShell>
      <BirthdayCake />
    </PageShell>
  );
}
