"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { UserProfile, PresenceStatus } from "@/types";
import { BADGE_REGISTRY } from "@/lib/badges";

// ── Status dot ───────────────────────────────────────────────────────────────

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
      className={`absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full border-[2.5px] border-[rgb(var(--bg-subtle))] ${colorClass[status]}`}
      aria-label={label[status]}
      role="img"
      title={label[status]}
    />
  );
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) { const m = Math.floor(diff / 60); return `${m}m ago`; }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return `${h}h ago`; }
  const d = Math.floor(diff / 86400);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

// ── Badge chip ────────────────────────────────────────────────────────────────

function BadgeChip({ id, label }: { id: string; label: string }) {
  const meta = BADGE_REGISTRY[id];
  const symbol = meta?.symbol ?? "🏷️";
  const displayLabel = meta?.label ?? label;

  return (
    <span
      aria-label={displayLabel}
      title={displayLabel}
      className="
        relative inline-flex h-[22px] w-[22px] items-center justify-center
        rounded-md text-[12px]
        bg-[rgb(var(--bg-muted))]
        transition-transform duration-150 hover:scale-125
        cursor-default group/badge
      "
    >
      {symbol}
      {/* Tooltip */}
      <span
        role="tooltip"
        className="
          pointer-events-none absolute bottom-full left-1/2 mb-1.5
          -translate-x-1/2 whitespace-nowrap rounded-md
          bg-[rgb(var(--text))] px-2 py-1
          text-[10px] font-medium text-[rgb(var(--bg))]
          opacity-0 group-hover/badge:opacity-100
          transition-opacity duration-150 z-20
        "
      >
        {displayLabel}
      </span>
    </span>
  );
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = value;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy Discord ID"}
      title={copied ? "Copied!" : "Copy Discord ID"}
      className="
        inline-flex items-center justify-center
        h-4 w-4 rounded
        text-[rgb(var(--text-tertiary))]
        hover:text-[rgb(var(--text-secondary))]
        hover:bg-[rgb(var(--bg-muted))]
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-1
        focus-visible:ring-[rgb(var(--border))]
        shrink-0
      "
    >
      {copied ? (
        // Checkmark
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        // Copy icon
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 4V2.8A.8.8 0 0 0 7.2 2H2.8A.8.8 0 0 0 2 2.8v4.4A.8.8 0 0 0 2.8 8H4"
            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

// ── ProfileCard ───────────────────────────────────────────────────────────────

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

      {/* Avatar + status */}
      <div className="relative px-4 pb-0">
        <div className="absolute -top-[26px] left-4">
          <div className="relative h-[52px] w-[52px] shrink-0 overflow-visible">
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-[rgb(var(--bg-subtle))] bg-[rgb(var(--bg-muted))]">
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
            <StatusDot status={profile.presence} />
          </div>
        </div>
        <div className="h-7" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 px-4 pb-4 pt-1">
        {/* Name + badges on same row */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="truncate text-[15px] font-semibold leading-snug text-[rgb(var(--text))]">
              {displayName}
            </h2>
            {/* Inline badges (up to 4 beside name) */}
            {profile.badges && profile.badges.length > 0 && (
              <div className="flex items-center gap-0.5 shrink-0">
                {profile.badges.slice(0, 4).map((badge) => (
                  <BadgeChip key={badge.id} id={badge.id} label={badge.label} />
                ))}
              </div>
            )}
          </div>
          <p className="truncate text-[12px] font-normal text-[rgb(var(--text-tertiary))] font-mono">
            @{profile.username}
          </p>
        </div>

        {/* Overflow badges (5+) */}
        {profile.badges && profile.badges.length > 4 && (
          <div className="flex flex-wrap gap-1">
            {profile.badges.slice(4).map((badge) => (
              <BadgeChip key={badge.id} id={badge.id} label={badge.label} />
            ))}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="line-clamp-3 text-[13px] leading-relaxed text-[rgb(var(--text-secondary))]">
            {profile.bio}
          </p>
        )}

        <div className="mt-auto" />

        {/* Footer */}
        <div className="border-t border-[rgb(var(--border))] pt-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[rgb(var(--text-tertiary))]">Joined</span>
            <span className="font-mono text-[11px] text-[rgb(var(--text-secondary))] tabular-nums">
              {formatJoinDate(profile.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[rgb(var(--text-tertiary))]">Updated</span>
            <span
              className="font-mono text-[11px] text-[rgb(var(--text-tertiary))] tabular-nums"
              title={new Date(profile.updated_at).toLocaleString()}
            >
              {formatRelativeTime(profile.updated_at)}
            </span>
          </div>

          {/* Discord ID + copy button */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <p className="font-mono text-[11px] text-[rgb(var(--text-tertiary))] tabular-nums tracking-tight truncate flex-1">
              {profile.discord_id}
            </p>
            <CopyButton value={profile.discord_id} />
          </div>
        </div>
      </div>
    </article>
  );
}
