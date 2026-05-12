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
  // Get the Discord OAuth provider session
  const { data: session } = await supabase.auth.getSession();
  const accessToken = session?.session?.provider_token;

  if (!accessToken) {
    console.error("No Discord access token found");
    return;
  }

  // Fetch full Discord user profile using the access token
  let discordUser: any = null;
  try {
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      discordUser = await response.json();
      console.log("Discord API user:", JSON.stringify(discordUser, null, 2));
    } else {
      console.warn("Failed to fetch Discord user:", response.status, response.statusText);
    }
  } catch (fetchError) {
    console.error("Error fetching Discord user:", fetchError);
  }

  // Fall back to metadata if Discord API fetch fails
  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};

  // Extract Discord ID (prioritize from API response)
  const discordId = discordUser?.id || metadata.provider_id || identityData.sub || user.id;

  // Extract avatar (Discord API has 'avatar' field)
  const avatarHash = discordUser?.avatar || metadata.avatar || identityData.avatar;
  const avatarUrl = avatarHash && discordId
    ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.webp?size=256`
    : null;

  // Extract banner (Discord API has 'banner' field)
  const bannerHash = discordUser?.banner || metadata.banner || identityData.banner;
  const bannerUrl = bannerHash && discordId
    ? `https://cdn.discordapp.com/banners/${discordId}/${bannerHash}.webp?size=600`
    : null;

  // Extract username
  const username = discordUser?.username || metadata.username || metadata.user_name || identityData.username || "unknown";

  // Extract display name (Discord API uses 'global_name')
  const displayName = discordUser?.global_name || metadata.global_name || metadata.display_name || null;

  // Extract accent color
  const accentColor = discordUser?.accent_color || metadata.accent_color || null;

  const profileData = {
    id: user.id,
    discord_id: discordId,
    username,
    display_name: displayName,
    avatar_url: avatarUrl,
    banner_url: bannerUrl,
    bio: discordUser?.bio || metadata.bio || null,
    gender: metadata.gender || null,
    badges: parseBadges(discordUser?.public_flags || metadata.public_flags || 0),
    presence: "offline",
    updated_at: new Date().toISOString(),
  };

  console.log("Final profile data:", JSON.stringify(profileData, null, 2));

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
