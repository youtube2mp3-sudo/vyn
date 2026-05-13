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
      aria-label="Sign out"
      title="Sign out"
      className="
        group relative inline-flex h-9 w-9 items-center justify-center
        rounded-xl
        text-[rgb(var(--text-tertiary))]
        transition-all duration-200
        hover:bg-red-500/10 hover:text-red-500
        disabled:pointer-events-none disabled:opacity-40
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-red-500/50
      "
    >
      {loading ? (
        /* Spinner */
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ) : (
        /* Door/logout icon — arrow leaving box */
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Box/door frame */}
          <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" />
          {/* Arrow out */}
          <path d="M10 11l3-3-3-3" />
          <path d="M13 8H6" />
        </svg>
      )}
      {/* Subtle glow on hover */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 rounded-xl
          opacity-0 transition-opacity duration-200
          group-hover:opacity-100
          shadow-[0_0_12px_rgba(239,68,68,0.25)]
        "
      />
    </button>
  );
}
