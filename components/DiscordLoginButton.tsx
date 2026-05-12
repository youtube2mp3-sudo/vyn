"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DiscordLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "identify email profile guilds",
      },
    });

    if (error) {
      console.error("OAuth error:", error.message);
      setLoading(false);
    }
    // If successful, browser redirects — no need to reset loading
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      aria-label="Continue with Discord"
      className="
        group inline-flex items-center gap-3
        rounded-xl px-6 py-3.5
        bg-[rgb(var(--text))] text-[rgb(var(--bg))]
        text-[14px] font-medium tracking-[-0.01em]
        transition-all duration-200
        hover:opacity-90 hover:scale-[1.015]
        active:scale-[0.985]
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[rgb(var(--text)/0.3)] focus-visible:ring-offset-2
        focus-visible:ring-offset-[rgb(var(--bg))]
      "
    >
      {loading ? (
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
        // Discord wordmark SVG (simplified)
        <svg
          width="18"
          height="14"
          viewBox="0 0 71 55"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M60.1045 4.8978C55.3195 2.8214 50.3139 1.2922 45.1245 0.9961C44.6645 1.9242 44.1345 3.0922 43.7745 4.2052C38.1385 3.4062 32.3805 3.4062 26.8045 4.2052C26.4445 3.0922 25.8945 1.9242 25.4195 0.9961C20.2281 1.2922 15.2226 2.8214 10.4381 4.8978C1.54371 21.7490 -0.943695 38.1237 0.293905 54.1693C5.47541 57.8017 10.7282 60.6619 16.0547 62.5575C17.2625 60.7418 18.3625 58.9326 19.3325 57.1489C17.9545 56.6709 16.6105 56.0814 15.3195 55.3771C15.8495 54.9721 16.3695 54.5597 16.8795 54.1457C21.0031 56.4183 25.5467 57.7904 30.3635 57.7904C35.1803 57.7904 39.7239 56.4183 43.8475 54.1457C44.3575 54.5597 44.8775 54.9721 45.4075 55.3771C44.1165 56.0814 42.7725 56.6709 41.3945 57.1489C42.3645 58.9326 43.4645 60.7418 44.6723 62.5575C49.9988 60.6619 55.2516 57.8017 60.4331 54.1693C61.8771 36.8499 57.7135 20.9529 60.1045 4.8978ZM23.7259 44.2979C20.2276 44.2979 17.3451 41.3154 17.3451 37.8171C17.3451 34.3188 20.2276 31.4363 23.7259 31.4363C27.2242 31.4363 30.1067 34.3188 30.1067 37.8171C30.1067 41.3154 27.2242 44.2979 23.7259 44.2979ZM47.3631 44.2979C43.8648 44.2979 40.9823 41.3154 40.9823 37.8171C40.9823 34.3188 43.8648 31.4363 47.3631 31.4363C50.8614 31.4363 53.7439 34.3188 53.7439 37.8171C53.7439 41.3154 50.8614 44.2979 47.3631 44.2979Z" />
        </svg>
      )}
      <span>{loading ? "Connecting…" : "Continue with Discord"}</span>
    </button>
  );
}
