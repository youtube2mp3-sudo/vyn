"use client";

import Image from "next/image";
import type { UserProfile, PresenceStatus } from "@/types";

const BADGE_LABELS: Record<string, string> = {
  staff: "Discord Staff",
  partner: "Partnered Server Owner",
  hypesquad: "HypeSquad Events",
  bug_hunter_level_1: "Bug Hunter Level 1",
  bug_hunter_level_2: "Bug Hunter Level 2",
  hypesquad_online_house_1: "HypeSquad Bravery",
  hypesquad_online_house_2: "HypeSquad Brilliance",
  hypesquad_online_house_3: "HypeSquad Balance",
  premium_early_supporter: "Early Supporter",
  verified_developer: "Early Verified Bot Developer",
  certified_moderator: "Discord Certified Moderator",
  active_developer: "Active Developer",
};

const BADGE_EMOJIS: Record<string, string> = {
  staff: "👮",
  partner: "🤝",
  hypesquad: "🏆",
  bug_hunter_level_1: "🐛",
  bug_hunter_level_2: "🏅",
  hypesquad_online_house_1: "🛡️",
  hypesquad_online_house_2: "💎",
  hypesquad_online_house_3: "⚖️",
  premium_early_supporter: "⭐",
  verified_developer: "🔧",
  certified_moderator: "✅",
  active_developer: "🏗️",
};

// Presence dot — absolutely positioned bottom-right of avatar,
// matching Discord's layout exactly.
function StatusDot({ status }: { status: PresenceStatus }) {
  const colorClass: Record<PresenceStatus, string> = {
    online: "status-online",
    idle: "status-idle",
    dnd: "status-dnd",
    offline: "status-offline",
    invisible: "status-offline",
  };

  const label: Record<PresenceStatus, string> = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
    invisible: "Invisible",
  };

  return (
    <span
      className={`
        absolute bottom-0 right-0
        h-[14px] w-[14px] rounded-full
        border-[2.5px] border-[rgb(var(--bg-subtle))]
        ${colorClass[status]}
      `}
      aria-label={label[status]}
      role="img"
      title={label[status]}
    />
  );
}

function formatJoinDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return "just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m} minute${m !== 1 ? "s" : ""} ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} hour${h !== 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

interface ProfileCardProps {
  profile: UserProfile;
  style?: React.CSSProperties;
}

export function ProfileCard({ profile, style }: ProfileCardProps) {
  const displayName = profile.display_name || profile.username;
  const avatarFallback = displayName.slice(0, 2).toUpperCase();

  return (
    <article
      style={style}
      className="
        group relative flex flex-col overflow-hidden
        rounded-2xl bg-[rgb(var(--bg-subtle))]
        border border-[rgb(var(--border))]
        transition-all duration-300 ease-out
        animate-fade-up
        hover:-translate-y-0.5
        hover:border-[rgb(var(--text-tertiary)/0.4)]
        focus-within:ring-2 focus-within:ring-[rgb(var(--border))]
      "
      aria-label={`${displayName}'s profile`}
    >
      {/* Banner */}
      <div className="relative h-20 w-full overflow-hidden bg-[rgb(var(--bg-muted))]">
        {profile.banner_url ? (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--bg-muted))] to-[rgb(var(--border))]" />
        )}
      </div>

      {/* Avatar row — avatar overlaps banner, status dot anchored bottom-right */}
      <div className="relative px-4 pb-0">
        {/* Avatar wrapper: absolute, overlapping banner */}
        <div className="absolute -top-[26px] left-4">
          <div
            className="
              relative h-[52px] w-[52px] shrink-0 overflow-visible
            "
          >
            {/* Circle clip for avatar image */}
            <div
              className="
                h-full w-full overflow-hidden rounded-full
                border-2 border-[rgb(var(--bg-subtle))]
                bg-[rgb(var(--bg-muted))]
              "
            >
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={`${displayName}'s avatar`}
                  fill
                  className="object-cover"
                  sizes="52px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[rgb(var(--text-tertiary))]">
                  {avatarFallback}
                </div>
              )}
            </div>

            {/* Status dot — Discord placement: bottom-right of avatar circle */}
            <StatusDot status={profile.presence} />
          </div>
        </div>

        {/* Spacer so content starts below avatar */}
        <div className="h-7" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-1">
        {/* Names */}
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-semibold leading-snug text-[rgb(var(--text))]">
            {displayName}
          </h2>
          <p className="truncate text-[12px] font-normal text-[rgb(var(--text-tertiary))] font-mono">
            @{profile.username}
          </p>
        </div>

        {/* Badges */}
        {profile.badges && profile.badges.length > 0 && (
          <div className="flex flex-wrap gap-1" aria-label="Badges">
            {profile.badges.slice(0, 6).map((badge) => {
              const emoji = BADGE_EMOJIS[badge.id] || "🏷️";
              const label = BADGE_LABELS[badge.id] || badge.label;
              return (
                <span
                  key={badge.id}
                  aria-label={label}
                  className="
                    relative inline-flex h-6 w-6 items-center justify-center
                    rounded-md bg-[rgb(var(--bg-muted))]
                    text-[13px] transition-transform duration-150
                    hover:scale-110
                    group/badge cursor-default
                  "
                >
                  {emoji}
                  {/* Tooltip */}
                  <span
                    className="
                      pointer-events-none absolute bottom-full left-1/2
                      mb-1.5 -translate-x-1/2
                      whitespace-nowrap rounded-md
                      bg-[rgb(var(--text))] px-2 py-1
                      text-[10px] font-medium text-[rgb(var(--bg))]
                      opacity-0 group-hover/badge:opacity-100
                      transition-opacity duration-150
                      z-10
                    "
                    role="tooltip"
                  >
                    {label}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="line-clamp-3 text-[13px] leading-relaxed text-[rgb(var(--text-secondary))]">
            {profile.bio}
          </p>
        )}

        {/* Spacer */}
        <div className="mt-auto" />

        {/* Dates + Discord ID footer */}
        <div className="border-t border-[rgb(var(--border))] pt-3 space-y-1.5">
          {/* Join date */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[rgb(var(--text-tertiary))]">
              Joined Board
            </span>
            <span className="font-mono text-[11px] text-[rgb(var(--text-secondary))] tabular-nums">
              {formatJoinDate(profile.created_at)}
            </span>
          </div>

          {/* Last updated */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[rgb(var(--text-tertiary))]">
              Updated
            </span>
            <span
              className="font-mono text-[11px] text-[rgb(var(--text-tertiary))] tabular-nums"
              title={new Date(profile.updated_at).toLocaleString()}
            >
              {formatRelativeTime(profile.updated_at)}
            </span>
          </div>

          {/* Discord ID */}
          <p
            className="
              font-mono text-[11px] text-[rgb(var(--text-tertiary))]
              tabular-nums tracking-tight pt-0.5
            "
          >
            {profile.discord_id}
          </p>
        </div>
      </div>
    </article>
  );
}
