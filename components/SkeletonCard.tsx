export function SkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <div
      className="
        flex flex-col overflow-hidden rounded-2xl
        bg-[rgb(var(--bg-subtle))]
        border border-[rgb(var(--border))]
        animate-fade-in
      "
      style={{ animationDelay: `${index * 60}ms` }}
      aria-hidden="true"
    >
      {/* Banner */}
      <div className="h-20 w-full skeleton" />

      {/* Content */}
      <div className="px-4 pb-5">
        {/* Avatar overlap area */}
        <div className="relative h-7">
          <div
            className="
              absolute -top-6 left-0
              h-[52px] w-[52px] rounded-full
              border-2 border-[rgb(var(--bg-subtle))]
              skeleton
            "
          />
        </div>

        <div className="mt-2 space-y-2.5">
          {/* Display name */}
          <div className="h-4 w-[60%] rounded-md skeleton" />
          {/* Username */}
          <div className="h-3 w-[40%] rounded-md skeleton" />

          {/* Bio lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full rounded-md skeleton" />
            <div className="h-3 w-[85%] rounded-md skeleton" />
            <div className="h-3 w-[70%] rounded-md skeleton" />
          </div>

          {/* ID */}
          <div className="border-t border-[rgb(var(--border))] pt-3">
            <div className="h-3 w-[55%] rounded-md skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}
