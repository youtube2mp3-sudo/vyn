import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { SignOutButton } from "./SignOutButton";

interface NavbarProps {
  user?: {
    display_name: string | null;
    username: string;
    avatar_url: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const displayName = user?.display_name || user?.username;
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : null;

  return (
    <header className="navbar-glass sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">

        {/* ── Left: logo + site name ── */}
        <a
          href="/"
          className="group flex items-center gap-3 transition-opacity duration-150 hover:opacity-75"
          aria-label="Cord Board — home"
        >
          {/* Logo — 36×36, rounded */}
          <span className="
            relative flex h-9 w-9 shrink-0 overflow-hidden rounded-xl
            ring-1 ring-black/10 dark:ring-white/10
            transition-transform duration-200 group-hover:scale-[1.05]
          ">
            <Image
              src="/logo.PNG"
              alt=""
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>

          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
            Cord Board
          </span>
        </a>

        {/* ── Right: theme · logout · avatar ── */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {user && (
            <>
              {/* Logout — red door icon */}
              <SignOutButton />

              {/* User avatar */}
              <div
                className="
                  relative ml-1 h-8 w-8 shrink-0 overflow-hidden
                  rounded-full bg-[rgb(var(--bg-muted))]
                  ring-2 ring-[rgb(var(--border))]
                "
                aria-label={`Signed in as ${displayName}`}
                title={`@${user.username}`}
              >
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={`${displayName}'s avatar`}
                    fill
                    sizes="32px"
                    className="object-cover object-center"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-[rgb(var(--text-tertiary))]">
                    {initials}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
