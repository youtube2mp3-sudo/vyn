import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import type { DiscordBadge } from "@/types";

const DISCORD_API = "https://discord.com/api/v10";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/board";

  if (!code) {
    console.error("No authorization code provided");
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  try {
    const supabase = await createClient();

    // Step 1: Exchange code for session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData.user) {
      console.error("Session exchange failed:", sessionError);
      return NextResponse.redirect(`${origin}/?error=auth_failed`);
    }

    const user = sessionData.user;
    console.log("✅ Session established for user:", user.id);

    // Step 2: Get the OAuth provider session with access token
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session?.session?.provider_token;

    if (!accessToken) {
      console.warn("⚠️ No provider token available, using metadata only");
      await syncProfileWithMetadata(supabase, user);
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.log("✅ Provider token found");

    // Step 3: Fetch full Discord user profile using access token
    let discordUser = null;
    try {
      const discordResponse = await fetch(`${DISCORD_API}/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!discordResponse.ok) {
        console.warn(
          `⚠️ Discord API returned ${discordResponse.status}`,
          await discordResponse.text()
        );
      } else {
        discordUser = await discordResponse.json();
        console.log("✅ Discord profile fetched:", {
          id: discordUser.id,
          username: discordUser.username,
          avatar: discordUser.avatar ? "present" : "missing",
          banner: discordUser.banner ? "present" : "missing",
        });
      }
    } catch (fetchError) {
      console.error("❌ Failed to fetch Discord profile:", fetchError);
    }

    // Step 4: Sync profile
    await syncDiscordProfile(supabase, user, discordUser);

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error("❌ Unexpected error in auth callback:", error);
    return NextResponse.redirect(`${origin}/?error=unexpected`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncProfileWithMetadata(supabase: any, user: any) {
  console.log("📝 Syncing profile from metadata only");
  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};
  await upsertProfile(supabase, user, null, metadata, identityData);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncDiscordProfile(supabase: any, user: any, discordUser: any) {
  console.log("📝 Syncing Discord profile");
  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};
  await upsertProfile(supabase, user, discordUser, metadata, identityData);
}

/**
 * Safe upsert: for returning users, fetch existing row and only
 * replace fields that have a fresher non-null value. This prevents
 * a missing provider_token from wiping avatar/banner/badges.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  discordUser: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identityData: any
) {
  // Fetch existing profile so we can merge safely
  const { data: existing } = await supabase
    .from("profiles")
    .select("avatar_url,banner_url,badges,username,display_name,bio")
    .eq("id", user.id)
    .maybeSingle();

  const fresh = buildProfileData(user, discordUser, metadata, identityData, existing);

  console.log("💾 Upserting profile:", {
    id: fresh.id,
    username: fresh.username,
    avatar: fresh.avatar_url ? "present" : "null",
    banner: fresh.banner_url ? "present" : "null",
    badges: fresh.badges?.length ?? 0,
  });

  const { error } = await supabase.from("profiles").upsert(fresh, {
    onConflict: "id",
  });

  if (error) {
    console.error("❌ Profile upsert failed:", error);
    throw error;
  }

  console.log("✅ Profile synced successfully");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildProfileData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  discordUser: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identityData: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existing: any
) {
  // Extract Discord ID
  const discordId =
    discordUser?.id ||
    metadata.provider_id ||
    identityData.sub ||
    user.id;

  // --- Avatar ---
  // Prefer freshly-fetched Discord hash → metadata hash → keep existing URL
  const avatarHash =
    discordUser?.avatar || metadata.avatar || identityData.avatar;
  const freshAvatarUrl =
    avatarHash && discordId
      ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.webp?size=256`
      : null;
  const avatarUrl = freshAvatarUrl ?? existing?.avatar_url ?? null;

  // --- Banner ---
  const bannerHash =
    discordUser?.banner || metadata.banner || identityData.banner;
  const freshBannerUrl =
    bannerHash && discordId
      ? `https://cdn.discordapp.com/banners/${discordId}/${bannerHash}.webp?size=600`
      : null;
  // Only overwrite existing banner when we have a fresh value; null banner_hash
  // from an API call without scope shouldn't erase a previously stored banner.
  const bannerUrl =
    discordUser !== null
      ? freshBannerUrl // We had a real API call — trust result (even null means no banner)
      : (freshBannerUrl ?? existing?.banner_url ?? null);

  // --- Username ---
  const freshUsername =
    discordUser?.username ||
    metadata.username ||
    metadata.user_name ||
    identityData.username ||
    null;
  const username = freshUsername ?? existing?.username ?? "unknown";

  // --- Display name ---
  const freshDisplayName =
    discordUser?.global_name ||
    metadata.global_name ||
    metadata.display_name ||
    null;
  const displayName = freshDisplayName ?? existing?.display_name ?? null;

  // --- Bio ---
  const freshBio = discordUser?.bio || metadata.bio || null;
  const bio = freshBio ?? existing?.bio ?? null;

  // --- Badges ---
  const publicFlags =
    discordUser?.public_flags ?? metadata.public_flags ?? null;
  let badges: DiscordBadge[];
  if (publicFlags !== null) {
    badges = parseBadges(publicFlags);
  } else {
    // No flags data — preserve existing badges
    badges = existing?.badges ?? [];
  }

  return {
    id: user.id,
    discord_id: discordId,
    username,
    display_name: displayName,
    avatar_url: avatarUrl,
    banner_url: bannerUrl,
    bio,
    gender: metadata.gender || null,
    badges,
    // Preserve presence — don't reset to offline on every login;
    // let it be managed by realtime updates separately.
    presence: "offline",
    updated_at: new Date().toISOString(),
  };
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
