import type { ReactNode } from "react"
import { Search, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { userLeagues } from "@/lib/mock"
import { TeamAvatar } from "./primitives"
import { IconRail } from "./icon-rail"
import { TopNav } from "./top-nav"

/* ------------------------------------------------------------------ *
 * Shell wrapper                                                      *
 * ------------------------------------------------------------------ */
export interface ShellProps {
  variant: "league" | "user"
  title?: string
  subtitle?: string
  activeLeagueId?: string
  headerExtra?: ReactNode
  /** Tailwind max-width class for the main content (e.g. "max-w-none"). */
  mainClassName?: string
  children: ReactNode
}

export function Shell({
  variant,
  activeLeagueId,
  headerExtra,
  mainClassName,
  children,
}: ShellProps) {
  const league = userLeagues.find((l) => l.id === activeLeagueId) ?? userLeagues[0]
  const isLeague = variant === "league"

  return (
    <div className="min-h-screen bg-background">
      <IconRail variant={variant} activeLeagueId={activeLeagueId} />
      <div className="pl-16">
        {/* Top bar — identity chip + shared dropdown nav, aligned to the rail brand zone */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-6">
            {/* Context identity — switching leagues lives in the left rail, not here */}
            <div className="flex items-center gap-2 px-1">
              {isLeague ? (
                <>
                  <TeamAvatar seed={league.hue} label={league.name} size={26} />
                  <span className="hidden text-sm font-semibold leading-none sm:inline">{league.name}</span>
                </>
              ) : (
                <>
                  <TeamAvatar seed="200" label="grayson" size={26} />
                  <span className="hidden text-sm font-semibold leading-none sm:inline">grayson</span>
                </>
              )}
            </div>

            {/* Top nav menu is league-only; user pages navigate via the icon rail. */}
            {isLeague && (
              <>
                <div className="mx-1 hidden h-5 w-px bg-border lg:block" />
                <TopNav variant="league" lid={league.id} />
              </>
            )}

            <div className="ml-auto flex items-center gap-2">
              {headerExtra}
              <div className="relative hidden md:block">
                <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search players, teams…"
                  className="h-9 w-52 rounded-lg border border-border bg-secondary/60 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Inbox"
              >
                <Inbox size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className={cn("mx-auto w-full px-6 py-6", mainClassName ?? "max-w-[1440px]")}>{children}</main>
      </div>
    </div>
  )
}
