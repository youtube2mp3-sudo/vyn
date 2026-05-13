import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { parseBadges } from "@/lib/badges";
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

    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData.user) {
      console.error("Session exchange failed:", sessionError);
      return NextResponse.redirect(`${origin}/?error=auth_failed`);
    }

    const user = sessionData.user;
    console.log("✅ Session established for user:", user.id);

    const { data: session } = await supabase.auth.getSession();
    const accessToken = session?.session?.provider_token;

    if (!accessToken) {
      console.warn("⚠️ No provider token — using metadata only");
      await upsertProfile(supabase, user, null);
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Fetch full Discord profile
    let discordUser = null;
    try {
      const res = await fetch(`${DISCORD_API}/users/@me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        discordUser = await res.json();
        console.log("✅ Discord profile fetched:", {
          id: discordUser.id,
          username: discordUser.username,
          public_flags: discordUser.public_flags,
          premium_type: discordUser.premium_type,
          avatar: discordUser.avatar,
          avatar_decoration_data: discordUser.avatar_decoration_data ?? null,
        });
      } else {
        console.warn(`⚠️ Discord API ${res.status}:`, await res.text());
      }
    } catch (e) {
      console.error("❌ Discord fetch failed:", e);
    }

    await upsertProfile(supabase, user, discordUser);
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.redirect(`${origin}/?error=unexpected`);
  }
}

/** Build a CDN avatar URL, handling animated avatars (a_ prefix → .gif). */
function avatarUrl(discordId: string, hash: string): string {
  const ext = hash.startsWith("a_") ? "gif" : "webp";
  return `https://cdn.discordapp.com/avatars/${discordId}/${hash}.${ext}?size=256`;
}

/** Build a CDN banner URL, handling animated banners (a_ prefix → .gif). */
function bannerUrl(discordId: string, hash: string): string {
  const ext = hash.startsWith("a_") ? "gif" : "webp";
  return `https://cdn.discordapp.com/banners/${discordId}/${hash}.${ext}?size=600`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertProfile(supabase: any, user: any, discordUser: any) {
  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};

  // ── Fetch existing row for safe-merge ─────────────────────────────────────
  // Include gender so it is preserved across re-logins (Discord does not
  // return a gender field — it would be lost without this select).
  const { data: existing } = await supabase
    .from("profiles")
    .select("avatar_url,banner_url,badges,username,display_name,bio,gender")
    .eq("id", user.id)
    .maybeSingle();

  // ── Discord ID ────────────────────────────────────────────────────────────
  const discordId =
    discordUser?.id || metadata.provider_id || identityData.sub || user.id;

  // ── Avatar ────────────────────────────────────────────────────────────────
  const avatarHash =
    discordUser?.avatar || metadata.avatar || identityData.avatar;
  const freshAvatar =
    avatarHash && discordId ? avatarUrl(discordId, avatarHash) : null;
  // Preserve existing avatar if we have no fresh value
  const resolvedAvatar = freshAvatar ?? existing?.avatar_url ?? null;

  // ── Banner ────────────────────────────────────────────────────────────────
  const bannerHash =
    discordUser?.banner || metadata.banner || identityData.banner;
  const freshBanner =
    bannerHash && discordId ? bannerUrl(discordId, bannerHash) : null;
  // When we had a live API call, trust its result (null = user removed banner).
  // Otherwise preserve whatever was stored.
  const resolvedBanner =
    discordUser !== null
      ? freshBanner
      : freshBanner ?? existing?.banner_url ?? null;

  // ── Text fields ───────────────────────────────────────────────────────────
  const username =
    discordUser?.username ||
    metadata.username ||
    metadata.user_name ||
    identityData.username ||
    existing?.username ||
    "unknown";

  const displayName =
    discordUser?.global_name ||
    metadata.global_name ||
    metadata.display_name ||
    existing?.display_name ||
    null;

  const bio =
    discordUser?.bio || metadata.bio || existing?.bio || null;

  // ── Gender — Discord does not expose gender in its API.
  // We preserve whatever was previously stored; metadata.gender is always null
  // from Discord OAuth, so this chain always falls back to existing value.
  const gender =
    metadata.gender || existing?.gender || null;

  // ── Badges ────────────────────────────────────────────────────────────────
  let badges: DiscordBadge[];
  if (discordUser !== null) {
    // Live data: always parse fresh (picks up public_flags + premium_type)
    badges = parseBadges(discordUser);
  } else if (metadata.public_flags != null) {
    // Metadata fallback — at least get flag badges
    badges = parseBadges(null, Number(metadata.public_flags));
  } else {
    // No data at all — preserve what we have
    badges = (existing?.badges as DiscordBadge[]) ?? [];
  }

  const profile = {
    id: user.id,
    discord_id: discordId,
    username,
    display_name: displayName,
    avatar_url: resolvedAvatar,
    banner_url: resolvedBanner,
    bio,
    gender,
    badges,
    presence: "offline" as const,
    updated_at: new Date().toISOString(),
  };

  console.log("💾 Upserting:", {
    username: profile.username,
    avatar: !!profile.avatar_url,
    animated_avatar: profile.avatar_url?.includes(".gif") ?? false,
    badges: profile.badges.length,
    gender: profile.gender,
  });

  const { error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" });

  if (error) {
    console.error("❌ Upsert failed:", error);
    throw error;
  }
  console.log("✅ Profile synced");
}
