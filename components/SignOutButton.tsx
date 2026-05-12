"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="
        inline-flex h-8 items-center gap-1.5
        rounded-lg px-3 text-[12px]
        text-[rgb(var(--text-tertiary))]
        transition-colors duration-150
        hover:bg-[rgb(var(--bg-muted))]
        hover:text-[rgb(var(--text-secondary))]
        disabled:opacity-50
        focus-visible:outline-none focus-visible:ring-1
        focus-visible:ring-[rgb(var(--border))]
      "
    >
      {loading ? "…" : "Sign out"}
    </button>
  );
}
