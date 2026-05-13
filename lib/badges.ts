/**
 * Discord Badge System — centralized registry.
 *
 * Data sources:
 *   public_flags  — bitmask returned by /users/@me
 *   premium_type  — integer returned by /users/@me
 *
 * Each entry has:
 *   flag/id    — Discord bit value / stable internal key
 *   label      — human-readable tooltip text
 *   color      — badge background hex (matches Discord brand)
 *   svgPath    — 16×16 viewBox white icon path (no emojis)
 *
 * To add a future badge → add one entry to FLAG_MAP or PREMIUM_MAP.
 * Nothing else needs to change.
 */

import type { DiscordBadge } from "@/types";

// ─── SVG icon paths (viewBox="0 0 16 16", white fill) ────────────────────────

const ICONS: Record<string, string> = {
  // Gear / wrench  →  Staff
  staff:
    "M8 5a3 3 0 100 6A3 3 0 008 5zm0 1.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 0a.75.75 0 01.75.75v.824a5.51 5.51 0 011.76.727l.583-.584a.75.75 0 011.06 1.06l-.583.584c.322.538.541 1.14.652 1.776H13a.75.75 0 010 1.5h-.778a5.506 5.506 0 01-.652 1.776l.583.583a.75.75 0 01-1.06 1.06l-.583-.582A5.51 5.51 0 018.75 14.426v.824a.75.75 0 01-1.5 0v-.824a5.51 5.51 0 01-1.76-.727l-.583.583a.75.75 0 01-1.06-1.06l.583-.583A5.506 5.506 0 013.778 10.5H3a.75.75 0 010-1.5h.778a5.506 5.506 0 01.652-1.776l-.583-.584a.75.75 0 011.06-1.06l.583.584A5.51 5.51 0 017.25 1.574V.75A.75.75 0 018 0z",

  // Crown  →  Partner
  partner:
    "M1 13h14v1.5H1V13zm.5-2L3 4l3.5 3L8 1l1.5 6L13 4l1.5 7H1.5z",

  // Flame  →  HypeSquad Events
  hypesquad_events:
    "M8 .5C5 4 3.5 6.5 3.5 9a4.5 4.5 0 009 0C12.5 6.5 11 4 8 .5zM8 13a2 2 0 01-2-2c0-1 .7-2 2-3 1.3 1 2 2 2 3a2 2 0 01-2 2z",

  // Bug  →  Bug Hunter Lv1
  bug_hunter_level_1:
    "M6 3a2 2 0 014 0h1.5a.5.5 0 010 1h-1.05A4.5 4.5 0 0111 6h.5a.5.5 0 010 1H11v.5a4 4 0 01-6 0V7h-.5a.5.5 0 010-1H5a4.5 4.5 0 01.55-2H4.5a.5.5 0 010-1H6zm2 1a3 3 0 00-3 3v.5a3 3 0 006 0V7a3 3 0 00-3-3z M6 2l-1-1.5M10 2l1-1.5",

  // Gold bug  →  Bug Hunter Lv2
  bug_hunter_level_2:
    "M8 1a2 2 0 012 2h1a.5.5 0 010 1h-.6A4 4 0 0111 6h.5a.5.5 0 010 1H11v.5a3 3 0 01-6 0V7h-.5a.5.5 0 010-1H5a4 4 0 01.6-2H5a.5.5 0 010-1h1a2 2 0 012-2zm0 2a2.5 2.5 0 00-2.5 2.5v.5a2.5 2.5 0 005 0V5.5A2.5 2.5 0 008 3zm0 2a1 1 0 110 2 1 1 0 010-2zM5 1.5L4 0M11 1.5l1-1.5",

  // Diamond  →  HypeSquad Bravery
  hypesquad_bravery:
    "M8 1l3 4H5L8 1zm0 13L5 10h6L8 14zM1 7.5L4 5v5L1 7.5zm14 0L12 10V5l3 2.5z",

  // Filled diamond  →  HypeSquad Brilliance
  hypesquad_brilliance:
    "M8 1l4 5-4 9-4-9 4-5zm0 0L3 6h10L8 1zm-4 5l4 8 4-8H4z",

  // Balanced diamond  →  HypeSquad Balance
  hypesquad_balance:
    "M8 1.5L5 7h6L8 1.5zM1 9l3.5 4.5L7 9H1zm8 0l2.5 4.5L15 9H9zm-4.5 0l3.5 4.5L11.5 9h-7z",

  // Star  →  Early Supporter
  early_supporter:
    "M8 .5l1.8 3.6 4 .6-2.9 2.8.7 4L8 9.4l-3.6 1.9.7-4L2.2 4.7l4-.6L8 .5z",

  // Verified checkmark in circle  →  Verified Developer
  verified_developer:
    "M8 1a7 7 0 100 14A7 7 0 008 1zm3.2 5.6l-3.8 3.8-1.6-1.6a.8.8 0 00-1.2 1.2l2.2 2.2a.8.8 0 001.2 0l4.4-4.4A.8.8 0 0011.2 6.6z",

  // Shield + check  →  Certified Moderator
  certified_moderator:
    "M8 .5L2 3v5c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V3L8 .5zm2.7 5.8l-3.2 3.2-1.2-1.2a.75.75 0 00-1.1 1.1l1.7 1.7a.75.75 0 001.1 0L11.8 7.4a.75.75 0 00-1.1-1.1z",

  // Terminal brackets  →  Active Developer
  active_developer:
    "M5 3.5L1.5 7 5 10.5l1-1L3.5 7 6 4.5 5 3.5zM11 3.5l-1 1L12.5 7 10 9.5l1 1L14.5 7 11 3.5zM9 2.5l-2 11h1.4l2-11H9z",

  // Bot face  →  Verified Bot (not shown on user profiles but in registry)
  verified_bot:
    "M8 1a7 7 0 100 14A7 7 0 008 1zm-2 6a1 1 0 112 0 1 1 0 01-2 0zm4 0a1 1 0 112 0 1 1 0 01-2 0zM5.5 11h5s-.5-2-2.5-2-2.5 2-2.5 2z",

  // HTTP interactions (bot HTTP)
  bot_http_interactions:
    "M2 3a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm0 6a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V9zm1 4a.5.5 0 000 1h3a.5.5 0 000-1H3z",

  // Diamond gem  →  Nitro
  nitro:
    "M8 1l5 4.5-5 9.5-5-9.5L8 1zm0 2L5 6.5 8 13l3-6.5L8 3z",

  // Classic gem  →  Nitro Classic
  nitro_classic:
    "M3 4h10l-2 2H5L3 4zm5 9L2 6h12L8 13z",

  // Basic  →  Nitro Basic
  nitro_basic:
    "M8 2a6 6 0 100 12A6 6 0 008 2zm0 2a4 4 0 014 4H4a4 4 0 014-4zm0 5a1 1 0 110 2 1 1 0 010-2z",
};

// ─── Flag map (ordered = display priority) ────────────────────────────────────
const FLAG_MAP: { flag: number; id: string; label: string; color: string }[] = [
  { flag: 1,        id: "staff",                 label: "Discord Staff",                color: "#e03d47" },
  { flag: 2,        id: "partner",               label: "Partnered Server Owner",       color: "#7289da" },
  { flag: 4,        id: "hypesquad_events",      label: "HypeSquad Events",             color: "#f47b67" },
  { flag: 8,        id: "bug_hunter_level_1",    label: "Bug Hunter",                   color: "#3ba55c" },
  { flag: 64,       id: "hypesquad_bravery",     label: "HypeSquad Bravery",            color: "#9c84ef" },
  { flag: 128,      id: "hypesquad_brilliance",  label: "HypeSquad Brilliance",         color: "#f47b67" },
  { flag: 256,      id: "hypesquad_balance",     label: "HypeSquad Balance",            color: "#45ddc0" },
  { flag: 512,      id: "early_supporter",       label: "Early Supporter",              color: "#eeb9f0" },
  { flag: 16384,    id: "bug_hunter_level_2",    label: "Bug Hunter Level 2",           color: "#f4900c" },
  { flag: 65536,    id: "verified_bot",          label: "Verified Bot",                 color: "#5865f2" },
  { flag: 131072,   id: "verified_developer",    label: "Early Verified Bot Developer", color: "#3ba55c" },
  { flag: 262144,   id: "certified_moderator",   label: "Discord Certified Moderator",  color: "#46b1c9" },
  { flag: 524288,   id: "bot_http_interactions", label: "Supports Commands",            color: "#5865f2" },
  { flag: 4194304,  id: "active_developer",      label: "Active Developer",             color: "#23a55a" },
];

const PREMIUM_MAP: Record<number, { id: string; label: string; color: string }> = {
  1: { id: "nitro_classic", label: "Nitro Classic", color: "#ff73fa" },
  2: { id: "nitro",         label: "Nitro",         color: "#ff73fa" },
  3: { id: "nitro_basic",   label: "Nitro Basic",   color: "#b97eff" },
};

// ─── Public registry ──────────────────────────────────────────────────────────

export interface BadgeMeta {
  id: string;
  label: string;
  color: string;
  svgPath: string;
}

export const BADGE_REGISTRY: Record<string, BadgeMeta> = {};

for (const entry of FLAG_MAP) {
  BADGE_REGISTRY[entry.id] = {
    id: entry.id,
    label: entry.label,
    color: entry.color,
    svgPath: ICONS[entry.id] ?? ICONS.active_developer,
  };
}
for (const [, entry] of Object.entries(PREMIUM_MAP)) {
  BADGE_REGISTRY[entry.id] = {
    id: entry.id,
    label: entry.label,
    color: entry.color,
    svgPath: ICONS[entry.id] ?? ICONS.nitro,
  };
}

// ─── Badge parser ─────────────────────────────────────────────────────────────

export function parseBadges(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  discordUser: any,
  fallbackFlags?: number
): import("@/types").DiscordBadge[] {
  const publicFlags: number = discordUser?.public_flags ?? fallbackFlags ?? 0;
  const premiumType: number | null = discordUser?.premium_type ?? null;

  const badges: import("@/types").DiscordBadge[] = [];
  const seen = new Set<string>();

  for (const entry of FLAG_MAP) {
    if ((publicFlags & entry.flag) !== 0 && !seen.has(entry.id)) {
      badges.push({ id: entry.id, label: entry.label });
      seen.add(entry.id);
    }
  }

  if (premiumType && premiumType > 0 && PREMIUM_MAP[premiumType]) {
    const nitro = PREMIUM_MAP[premiumType];
    if (!seen.has(nitro.id)) {
      badges.push({ id: nitro.id, label: nitro.label });
      seen.add(nitro.id);
    }
  }

  return badges;
}

export type { DiscordBadge } from "@/types";
