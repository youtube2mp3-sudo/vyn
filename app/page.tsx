import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DiscordLoginButton } from "@/components/DiscordLoginButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/board");
  }

  return (
    <div className="relative flex min-h-svh flex-col">
      {/* Theme toggle — top right */}
      <div className="absolute right-6 top-5 z-10">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div
          className="flex flex-col items-center gap-10 text-center animate-fade-up"
          style={{ animationDuration: "0.6s" }}
        >
          {/* Wordmark */}
          <div className="space-y-4">
            <h1 className="text-[40px] font-semibold tracking-[-0.04em] leading-none text-[rgb(var(--text))] sm:text-[56px]">
              Profiles
            </h1>
            <p className="max-w-xs text-[15px] leading-relaxed text-[rgb(var(--text-secondary))]">
              A minimal directory of Discord users.
              <br />
              Sign in once. Appear forever.
            </p>
          </div>

          {/* CTA */}
          <DiscordLoginButton />

          {/* Footnote */}
          <p className="text-[12px] text-[rgb(var(--text-tertiary))] max-w-[260px] leading-relaxed">
            We only store public Discord profile information. No messages, no
            servers.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center">
        <p className="text-[11px] text-[rgb(var(--text-tertiary))]">
          Not affiliated with Discord Inc.
        </p>
      </footer>
    </div>
  );
}
