"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const played = sessionStorage.getItem("twin_intro_played");
    if (played) {
      router.replace("/home");
    } else {
      router.replace("/intro");
    }
  }, [router]);

  // Render nothing while redirecting — void background matches intro start
  return (
    <div
      className="fixed inset-0"
      style={{ backgroundColor: "#05070f" }}
    />
  );
}
