"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import PasswordScreen from "@/components/password/PasswordScreen";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function PasswordPage() {
  const router = useRouter();
  const handleUnlocked = useCallback(() => {
    router.push("/intro");
  }, [router]);

  return (
    <>
      <ThemeToggle />
      <PasswordScreen onUnlocked={handleUnlocked} />
    </>
  );
}
