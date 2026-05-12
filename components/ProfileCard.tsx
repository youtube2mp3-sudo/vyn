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

function StatusDot({ status }: { status: PresenceStatus }) {
  const cls: Record<PresenceStatus, string> = {
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
        block h-3 w-3 rounded-full border-2
        border-[rgb(var(--bg))]
        ${cls[status]}
      `}
      aria-label={label[status]}
      role="img"
      title={label[status]}
    />
  );
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

      {/* Avatar row */}
      <div className="relative px-4 pb-0">
        <div className="absolute -top-6 left-4 flex items-end gap-1.5">
          <div
            className="
              relative h-[52px] w-[52px] shrink-0 overflow-hidden
              rounded-full border-2 border-[rgb(var(--bg-subtle))]
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
          {/* Status dot — anchored bottom-right of avatar */}
          <div className="relative -top-0.5">
            <StatusDot status={profile.presence} />
          </div>
        </div>

        {/* Spacer for avatar */}
        <div className="h-7" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 pb-5 pt-1">
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
                  title={label}
                  aria-label={label}
                  className="
                    inline-flex h-6 w-6 items-center justify-center
                    rounded-md bg-[rgb(var(--bg-muted))]
                    text-[13px] transition-transform duration-150
                    hover:scale-110
                  "
                >
                  {emoji}
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

        {/* Gender */}
        {profile.gender && (
          <p className="text-[12px] text-[rgb(var(--text-tertiary))]">
            {profile.gender}
          </p>
        )}

        {/* Discord ID */}
        <div className="mt-auto border-t border-[rgb(var(--border))] pt-3">
          <p
            className="
              font-mono text-[11px] text-[rgb(var(--text-tertiary))]
              tabular-nums tracking-tight
            "
          >
            {profile.discord_id}
          </p>
        </div>
      </div>
    </article>
  );
}
