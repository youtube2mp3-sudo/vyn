/**
 * Centralized Discord badge system.
 *
 * Sources:
 *   - public_flags  (bitmask from /users/@me)
 *   - premium_type  (integer from /users/@me — Nitro tier)
 *
 * To add future badges: add an entry to FLAG_MAP or PREMIUM_MAP.
 * Badge order in the arrays defines display priority.
 */

import type { DiscordBadge } from "@/types";

// ── public_flags bitmask ──────────────────────────────────────────────────────
// Values from https://discord.com/developers/docs/resources/user#user-object-user-flags
const FLAG_MAP: { flag: number; id: string; label: string; color: string; symbol: string }[] = [
  { flag: 1,       id: "staff",                   label: "Discord Staff",                  color: "#3BA55C", symbol: "⚙️" },
  { flag: 2,       id: "partner",                  label: "Partnered Server Owner",          color: "#8CA0E0", symbol: "🤝" },
  { flag: 4,       id: "hypesquad_events",         label: "HypeSquad Events",               color: "#F47B67", symbol: "🏆" },
  { flag: 8,       id: "bug_hunter_level_1",       label: "Bug Hunter",                     color: "#EB459E", symbol: "🐛" },
  { flag: 64,      id: "hypesquad_bravery",        label: "HypeSquad Bravery",              color: "#9C84EF", symbol: "🛡️" },
  { flag: 128,     id: "hypesquad_brilliance",     label: "HypeSquad Brilliance",           color: "#F47B67", symbol: "💎" },
  { flag: 256,     id: "hypesquad_balance",        label: "HypeSquad Balance",              color: "#45DDC0", symbol: "⚖️" },
  { flag: 512,     id: "early_supporter",          label: "Early Supporter",                color: "#EEB9F0", symbol: "⭐" },
  { flag: 16384,   id: "bug_hunter_level_2",       label: "Bug Hunter Level 2",             color: "#F4900C", symbol: "🏅" },
  { flag: 65536,   id: "verified_bot",             label: "Verified Bot",                   color: "#5865F2", symbol: "✔️" },
  { flag: 131072,  id: "verified_developer",       label: "Early Verified Bot Developer",   color: "#3BA55C", symbol: "🔧" },
  { flag: 262144,  id: "certified_moderator",      label: "Discord Certified Moderator",    color: "#46B1C9", symbol: "🛡️" },
  { flag: 524288,  id: "bot_http_interactions",    label: "HTTP Interactions Bot",          color: "#5865F2", symbol: "🤖" },
  { flag: 4194304, id: "active_developer",         label: "Active Developer",               color: "#5865F2", symbol: "🏗️" },
];

// ── premium_type → Nitro badge ────────────────────────────────────────────────
const PREMIUM_MAP: Record<number, { id: string; label: string; color: string; symbol: string }> = {
  1: { id: "nitro_classic",  label: "Nitro Classic",  color: "#FF73FA", symbol: "💠" },
  2: { id: "nitro",          label: "Nitro",          color: "#FF73FA", symbol: "✨" },
  3: { id: "nitro_basic",    label: "Nitro Basic",    color: "#FF73FA", symbol: "💎" },
};

export interface BadgeMeta {
  id: string;
  label: string;
  color: string;   // hex — used for badge background tint
  symbol: string;  // emoji fallback for rendering
}

/** Full badge registry — used by UI for label/color lookups */
export const BADGE_REGISTRY: Record<string, BadgeMeta> = {};
for (const entry of FLAG_MAP) {
  BADGE_REGISTRY[entry.id] = { id: entry.id, label: entry.label, color: entry.color, symbol: entry.symbol };
}
for (const entry of Object.values(PREMIUM_MAP)) {
  BADGE_REGISTRY[entry.id] = { id: entry.id, label: entry.label, color: entry.color, symbol: entry.symbol };
}

/**
 * Convert raw Discord API user data into our badge array.
 * Pass the full discordUser object — we read public_flags and premium_type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBadges(discordUser: any, fallbackFlags?: number): DiscordBadge[] {
  const publicFlags: number =
    discordUser?.public_flags ?? fallbackFlags ?? 0;
  const premiumType: number | null =
    discordUser?.premium_type ?? null;

  const badges: DiscordBadge[] = [];
  const seen = new Set<string>();

  // 1. public_flags badges (in priority order)
  for (const entry of FLAG_MAP) {
    if ((publicFlags & entry.flag) !== 0 && !seen.has(entry.id)) {
      badges.push({ id: entry.id, label: entry.label });
      seen.add(entry.id);
    }
  }

  // 2. Nitro badge from premium_type
  if (premiumType && premiumType > 0 && PREMIUM_MAP[premiumType]) {
    const nitro = PREMIUM_MAP[premiumType];
    if (!seen.has(nitro.id)) {
      badges.push({ id: nitro.id, label: nitro.label });
      seen.add(nitro.id);
    }
  }

  return badges;
}
