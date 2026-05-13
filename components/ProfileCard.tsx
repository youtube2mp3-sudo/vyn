"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { UserProfile, PresenceStatus } from "@/types";
import { BADGE_REGISTRY } from "@/lib/badges";

// ─── Presence dot ─────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: PresenceStatus }) {
  const bg: Record<PresenceStatus, string> = {
    online:    "#23a55a",
    idle:      "#f0b232",
    dnd:       "#f23f43",
    offline:   "#80848e",
    invisible: "#80848e",
  };
  const label: Record<PresenceStatus, string> = {
    online: "Online", idle: "Idle", dnd: "Do Not Disturb",
    offline: "Offline", invisible: "Invisible",
  };
  return (
    <span
      aria-label={label[status]}
      title={label[status]}
      role="img"
      style={{ backgroundColor: bg[status] }}
      className="
        absolute bottom-[1px] right-[1px]
        h-[13px] w-[13px] rounded-full
        border-2 border-[rgb(var(--bg-subtle))]
      "
    />
  );
}

// ─── SVG badge chip ───────────────────────────────────────────────────────────

function BadgeChip({ id, label }: { id: string; label: string }) {
  const meta = BADGE_REGISTRY[id];
  if (!meta) return null;

  return (
    <span
      aria-label={meta.label}
      role="img"
      className="group/badge relative inline-flex h-[22px] w-[22px] shrink-0 cursor-default items-center justify-center rounded-md transition-transform duration-150 hover:scale-125"
      style={{ backgroundColor: meta.color + "22" }} /* 13% opacity tint */
    >
      {/* SVG icon */}
      <svg
        viewBox="0 0 16 16"
        width="13"
        height="13"
        fill={meta.color}
        aria-hidden="true"
      >
        <path d={meta.svgPath} />
      </svg>

      {/* Tooltip */}
      <span
        role="tooltip"
        className="
          pointer-events-none absolute bottom-full left-1/2 z-20
          mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg
          bg-[rgb(var(--text))] px-2.5 py-1
          text-[10px] font-medium leading-none text-[rgb(var(--bg))]
          opacity-0 shadow-lg
          transition-opacity duration-150
          group-hover/badge:opacity-100
        "
      >
        {meta.label}
        {/* Arrow */}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[rgb(var(--text))]" />
      </span>
    </span>
  );
}

// ─── Copy ID button ───────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy Discord ID"}
      title={copied ? "Copied!" : "Copy Discord ID"}
      className="
        inline-flex h-5 w-5 shrink-0 items-center justify-center
        rounded-md text-[rgb(var(--text-tertiary))]
        transition-all duration-150
        hover:bg-[rgb(var(--bg-muted))] hover:text-[rgb(var(--text-secondary))]
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgb(var(--border))]
      "
    >
      {copied ? (
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#23a55a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 6.5l2.5 2.5 5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
          <rect x="4.5" y="4.5" width="6" height="6" rx="1" />
          <path d="M7.5 4.5V3A1 1 0 006.5 2h-3A1 1 0 002.5 3v3A1 1 0 003.5 7H4.5" />
        </svg>
      )}
    </button>
  );
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtRel(iso: string) {
  const s = Math.floor((Date.now() - +new Date(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

// ─── ProfileCard ──────────────────────────────────────────────────────────────

export function ProfileCard({ profile, style }: { profile: UserProfile; style?: React.CSSProperties }) {
  const displayName = profile.display_name || profile.username;
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasBadges = profile.badges && profile.badges.length > 0;

  return (
    <article
      style={style}
      aria-label={`${displayName}'s profile`}
      className="
        group relative flex flex-col overflow-hidden
        rounded-2xl bg-[rgb(var(--bg-subtle))]
        border border-[rgb(var(--border))]
        transition-all duration-300 ease-out
        animate-fade-up
        hover:-translate-y-[2px]
        hover:border-[rgb(var(--text-tertiary)/0.35)]
        hover:shadow-[0_8px_24px_rgb(0_0_0/0.08)] dark:hover:shadow-[0_8px_24px_rgb(0_0_0/0.4)]
        focus-within:ring-2 focus-within:ring-[rgb(var(--border))]
      "
    >
      {/* Banner */}
      <div className="relative h-[72px] w-full overflow-hidden bg-[rgb(var(--bg-muted))]">
        {profile.banner_url ? (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--bg-muted))] to-[rgb(var(--border))]" />
        )}
      </div>

      {/* Avatar — overlapping banner, perfectly circular */}
      <div className="relative px-4">
        <div className="absolute -top-7 left-4">
          {/* Outer ring wrapper — overflow-visible so status dot isn't clipped */}
          <div className="relative h-14 w-14">
            {/* Circle mask */}
            <div className="
              h-14 w-14 overflow-hidden rounded-full
              border-[3px] border-[rgb(var(--bg-subtle))]
              bg-[rgb(var(--bg-muted))]
            ">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={`${displayName}'s avatar`}
                  fill
                  sizes="56px"
                  className="object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[rgb(var(--text-tertiary))]">
                  {initials}
                </div>
              )}
            </div>
            {/* Status dot — outside clip area */}
            <StatusDot status={profile.presence} />
          </div>
        </div>
        {/* Spacer matching avatar overlap */}
        <div className="h-8" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 px-4 pb-4 pt-0.5">

        {/* Name + inline badges */}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <h2 className="truncate text-[15px] font-semibold leading-tight text-[rgb(var(--text))]">
              {displayName}
            </h2>
            {hasBadges && (
              <div className="flex shrink-0 items-center gap-0.5">
                {profile.badges.slice(0, 4).map((b) => (
                  <BadgeChip key={b.id} id={b.id} label={b.label} />
                ))}
              </div>
            )}
          </div>
          <p className="truncate font-mono text-[12px] text-[rgb(var(--text-tertiary))]">
            @{profile.username}
          </p>
        </div>

        {/* Overflow badges */}
        {hasBadges && profile.badges.length > 4 && (
          <div className="flex flex-wrap gap-0.5">
            {profile.badges.slice(4).map((b) => (
              <BadgeChip key={b.id} id={b.id} label={b.label} />
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
        <div className="space-y-1.5 border-t border-[rgb(var(--border))] pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[rgb(var(--text-tertiary))]">Joined</span>
            <span className="font-mono text-[11px] tabular-nums text-[rgb(var(--text-secondary))]">
              {fmtDate(profile.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[rgb(var(--text-tertiary))]">Updated</span>
            <span
              title={new Date(profile.updated_at).toLocaleString()}
              className="font-mono text-[11px] tabular-nums text-[rgb(var(--text-tertiary))]"
            >
              {fmtRel(profile.updated_at)}
            </span>
          </div>
          {/* ID + copy */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <p className="flex-1 truncate font-mono text-[11px] tabular-nums tracking-tight text-[rgb(var(--text-tertiary))]">
              {profile.discord_id}
            </p>
            <CopyButton value={profile.discord_id} />
          </div>
        </div>
      </div>
    </article>
  );
}
