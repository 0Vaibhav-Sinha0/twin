"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const unlocked = sessionStorage.getItem("twin_unlocked");
    const introPlayed = sessionStorage.getItem("twin_intro_played");

    if (!unlocked) {
      router.replace("/password");
    } else if (!introPlayed) {
      router.replace("/intro");
    } else {
      router.replace("/home");
    }
  }, [router]);

  return (
    <div className="fixed inset-0" style={{ backgroundColor: "#05070f" }} />
  );
}
