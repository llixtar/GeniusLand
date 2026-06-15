"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminShortcutListener() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Log for debugging layout issues
      console.log("Admin shortcut event:", { key: e.key, code: e.code, altKey: e.altKey, shiftKey: e.shiftKey });

      const isKeyA = 
        e.code === "KeyA" || 
        e.key.toLowerCase() === "a" || 
        e.key.toLowerCase() === "ф";

      if (e.altKey && e.shiftKey && isKeyA) {
        e.preventDefault();
        console.log("Admin shortcut triggered! Redirecting...");
        router.push("/admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
