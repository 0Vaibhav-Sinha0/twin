"use client";

import BirthdayCake from "@/components/cake/BirthdayCake";
import BottomDock from "@/components/shared/BottomDock";
import { useForceDarkMode } from "@/lib/theme";

export default function CakePage() {
  // The cake is a fixed nighttime magic scene — always dark,
  // regardless of the site-wide light/dark toggle.
  useForceDarkMode();

  return (
    <main className="relative">
      <BirthdayCake />
      <BottomDock />
    </main>
  );
}
