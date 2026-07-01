"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import IntroScene from "@/components/intro/IntroScene";

export default function IntroPage() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    // Mark intro as played in session storage
    sessionStorage.setItem("twin_intro_played", "true");
    router.push("/home");
  }, [router]);

  return <IntroScene onComplete={handleComplete} />;
}
