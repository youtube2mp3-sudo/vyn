import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import type { DiscordBadge } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/board";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      try {
        await syncDiscordProfile(supabase, data.user);
      } catch (syncError) {
        console.error("Profile sync error:", syncError);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth_failed`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncDiscordProfile(supabase: any, user: any) {
  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};

  const discordId = metadata.provider_id || identityData.sub || user.id;
  const avatarHash = metadata.avatar_hash || identityData.avatar;
  const avatarUrl = avatarHash
    ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.webp?size=256`
    : null;

  const bannerHash = metadata.banner || identityData.banner;
  const bannerUrl = bannerHash
    ? `https://cdn.discordapp.com/banners/${discordId}/${bannerHash}.webp?size=600`
    : null;

  const profileData = {
    id: user.id,
    discord_id: discordId,
    username: metadata.user_name || metadata.name || "unknown",
    display_name: metadata.full_name || metadata.global_name || null,
    avatar_url: avatarUrl,
    banner_url: bannerUrl,
    bio: metadata.bio || null,
    gender: metadata.gender || null,
    badges: parseBadges(metadata.public_flags || 0),
    presence: "offline",
    updated_at: new Date().toISOString(),
  };

  await supabase.from("profiles").upsert(profileData, { onConflict: "id" });
}

function parseBadges(publicFlags: number): DiscordBadge[] {
  const FLAG_MAP: Record<number, string> = {
    1: "staff",
    2: "partner",
    4: "hypesquad",
    8: "bug_hunter_level_1",
    64: "hypesquad_online_house_1",
    128: "hypesquad_online_house_2",
    256: "hypesquad_online_house_3",
    512: "premium_early_supporter",
    16384: "bug_hunter_level_2",
    131072: "verified_developer",
    262144: "certified_moderator",
    4194304: "active_developer",
  };

  return Object.entries(FLAG_MAP)
    .filter(([flag]) => (publicFlags & Number(flag)) !== 0)
    .map(([, id]) => ({ id, label: id.replace(/_/g, " ") }));
}
