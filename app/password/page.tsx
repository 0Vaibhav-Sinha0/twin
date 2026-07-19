"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import PasswordScreen from "@/components/password/PasswordScreen";

export default function PasswordPage() {
  const router = useRouter();
  const handleUnlocked = useCallback(() => {
    router.push("/intro");
  }, [router]);

  return <PasswordScreen onUnlocked={handleUnlocked} />;
}
