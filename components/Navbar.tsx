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
  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.85)] backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
        {/* Wordmark */}
        <a
          href="/"
          className="
            text-[13px] font-medium tracking-[-0.01em]
            text-[rgb(var(--text))]
            transition-opacity hover:opacity-70
          "
        >
          Profiles
        </a>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <SignOutButton />}
        </div>
      </div>
    </header>
  );
}
