import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileBoardClient } from "@/components/ProfileBoardClient";
import { Navbar } from "@/components/Navbar";
import type { UserProfile } from "@/types";

export const revalidate = 30;

export default async function BoardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const profiles = (data as unknown as UserProfile[]) ?? [];
  const currentUserProfile = profiles.find((p) => p.id === user.id) ?? null;

  return (
    <div className="flex min-h-svh flex-col bg-[rgb(var(--bg))]">
      <Navbar
        user={
          currentUserProfile
            ? {
                display_name: currentUserProfile.display_name,
                username: currentUserProfile.username,
                avatar_url: currentUserProfile.avatar_url,
              }
            : null
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <div className="mb-10 animate-fade-up">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
            Members
          </h1>
          <p className="mt-1 text-[14px] text-[rgb(var(--text-tertiary))]">
            Everyone who&apos;s joined the board.
          </p>
        </div>

        <ProfileBoardClient
          profiles={profiles}
          totalCount={count ?? 0}
        />
      </main>

      <footer className="border-t border-[rgb(var(--border))] px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] text-[rgb(var(--text-tertiary))]">
            Profiles — Not affiliated with Discord Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
