"use client";

import { useCallback, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search profiles…",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className="relative w-full max-w-xs">
      {/* Search icon */}
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-tertiary))]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search profiles"
        className="
          h-8 w-full rounded-lg
          bg-[rgb(var(--bg-muted))]
          border border-[rgb(var(--border))]
          pl-8 pr-8 text-[13px]
          text-[rgb(var(--text))]
          placeholder:text-[rgb(var(--text-tertiary))]
          outline-none
          transition-all duration-200
          focus:border-[rgb(var(--text-tertiary))]
          focus:bg-[rgb(var(--bg-subtle))]
          focus:ring-1 focus:ring-[rgb(var(--border))]
          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            flex h-4 w-4 items-center justify-center rounded-full
            bg-[rgb(var(--text-tertiary))] text-[rgb(var(--bg))]
            transition-opacity duration-150 hover:opacity-80
          "
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
