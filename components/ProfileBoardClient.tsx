"use client";

import { useState, useMemo } from "react";
import type { UserProfile } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { SkeletonCard } from "./SkeletonCard";
import { SearchBar } from "./SearchBar";

interface ProfileBoardClientProps {
  profiles: UserProfile[];
  totalCount: number;
  isLoading?: boolean;
}

export function ProfileBoardClient({
  profiles,
  totalCount,
  isLoading = false,
}: ProfileBoardClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return profiles;
    const q = query.toLowerCase();
    return profiles.filter(
      (p) =>
        p.username.toLowerCase().includes(q) ||
        (p.display_name?.toLowerCase().includes(q) ?? false) ||
        p.discord_id.includes(q) ||
        (p.bio?.toLowerCase().includes(q) ?? false)
    );
  }, [profiles, query]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar value={query} onChange={setQuery} />

        <p
          className="shrink-0 font-mono text-[12px] text-[rgb(var(--text-tertiary))] tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {query ? (
            <>
              <span className="text-[rgb(var(--text-secondary))]">
                {filtered.length}
              </span>{" "}
              result{filtered.length !== 1 ? "s" : ""}
            </>
          ) : (
            <>
              <span className="text-[rgb(var(--text-secondary))]">
                {totalCount}
              </span>{" "}
              member{totalCount !== 1 ? "s" : ""}
            </>
          )}
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[14px] text-[rgb(var(--text-tertiary))]">
            No profiles match{" "}
            <span className="font-mono text-[rgb(var(--text-secondary))]">
              &ldquo;{query}&rdquo;
            </span>
          </p>
          <button
            onClick={() => setQuery("")}
            className="
              mt-3 text-[13px] text-[rgb(var(--text-tertiary))]
              underline underline-offset-2
              hover:text-[rgb(var(--text-secondary))]
              transition-colors duration-150
            "
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
